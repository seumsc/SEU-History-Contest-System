using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using System.IO;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc.Razor;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.SpaServices.Webpack;
using Microsoft.AspNetCore.Session;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.FileProviders;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.PlatformAbstractions;
using Microsoft.Extensions.Logging;
using Microsoft.EntityFrameworkCore;
using Swashbuckle.AspNetCore.Swagger;
using HistoryContest.Server.Data;
using HistoryContest.Server.Services;
using HistoryContest.Server.Extensions;
using Microsoft.Extensions.Options;

namespace HistoryContest.Server
{
    public class Startup
    {
        public static IConfigurationRoot Configuration { get; set; }
        public static IHostingEnvironment Environment { get; set; }
        private static Timer syncWithDatabaseTimer;

        public Startup(IHostingEnvironment env)
        {
            if (!Program.FromMain)
            {
                env.EnvironmentName = Program.EnvironmentName;
                env.ContentRootPath = Program.ContentRootPath;
                env.WebRootPath = Path.Combine(env.ContentRootPath, "wwwroot");
            }

            Environment = env;
            var builder = new ConfigurationBuilder()
                .SetBasePath(Path.Combine(env.ContentRootPath, env.IsDevelopment() ? "HistoryContest.Server" : ""))
                .AddJsonFile("appsettings.json", optional: true, reloadOnChange: true)
                .AddJsonFile($"appsettings.{env.EnvironmentName}.json", optional: true)
                .AddEnvironmentVariables();
            Configuration = builder.Build();
        }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            // Add mvc framework services.
            var mvcBuilder = services.AddMvc();

            if (Environment.IsDevelopment())
            {
                mvcBuilder.AddRazorOptions(options =>
                {
                    options.ViewLocationExpanders.Clear();
                    options.ViewLocationExpanders.Add(new LocalViewEngine());
                });
            }

            // Bind Contest Setting with Configuration
            services.Configure<ContestSetting>(Configuration.GetSection("Contest"));

            // Add Contest Settings
            services.Configure<ContestSetting>(c => 
            {
                var contest = Configuration.GetSection("Contest");
                c.TestTime = TimeSpan.FromMinutes(int.Parse(contest["TestTime"]));
                c.SchoolScoreSummaryExpireTime = TimeSpan.FromMinutes(int.Parse(contest["SchoolScoreSummaryExpireTime"]));
            });

            // Add Database Services
            services.AddDbContext<ContestContext>(options =>
                options.UseSqlServer(Configuration.GetConnectionStringByDbType("SQL")));

            // Adds a redis in-memory implementation of IDistributedCache.
            services.AddDistributedRedisCache(options =>
            {
                options.InstanceName = "HistoryContest.Redis";
                options.Configuration = Configuration.GetConnectionStringByDbType("Redis");
            });

            // Add redis service
            services.AddScoped<RedisService>();

            // Add Unit of work service
            services.AddScoped<UnitOfWork>();

#if NETCOREAPP2_0
            services.AddAuthentication(CookieAuthenticationDefaults.AuthenticationScheme).AddCookie(options =>
            {
                options.LoginPath = new PathString("/Account/Login/");
                options.LogoutPath = new PathString("/Account/Logout");
                options.AccessDeniedPath = new PathString("/");
                options.Cookie.Name = "HistoryContest.Cookie.Auth";
                // options.Cookie.Domain = "";
                options.Cookie.Path = "/";
                options.Cookie.HttpOnly = true;
                // options.Cookie.SameSite = SameSiteMode.Lax;
                // options.Cookie.SecurePolicy = CookieSecurePolicy.Always;
            });

            services.AddSession(options =>
            {
                options.IdleTimeout = TimeSpan.FromMinutes(30);
                options.Cookie.Name = "HistoryContest.Cookie.Session";
                // options.Cookie.Domain = "";
                options.Cookie.Path = "/";
                options.Cookie.HttpOnly = true;
                // options.Cookie.SameSite = SameSiteMode.Lax;
                // options.Cookie.SecurePolicy = CookieSecurePolicy.Always;
            });

#else
            services.AddAuthentication(options => options.SignInScheme = CookieAuthenticationDefaults.AuthenticationScheme);

            services.AddSession(options =>
            {
                options.IdleTimeout = TimeSpan.FromMinutes(30);
                options.CookieName = "HistoryContest.Cookie.Session";
                // options.CookieDomain = "";
                options.CookiePath = "/";
                options.CookieHttpOnly = true;
                // options.CookieSameSite = SameSiteMode.Lax;
                // options.CookieSecure = CookieSecurePolicy.Always;
            });
#endif

            // Add logging services to application
            services.AddLogging();

            // Register the Swagger generator, defining one or more Swagger documents
            services.AddSwaggerGen(c =>
            {
                c.SwaggerDoc("seu-history-contest", new Info
                {
                    Title = "SEU History Contest API",
                    Version = "v1",
                    Description = "Backend Web API for History Contest System front end.",
                    TermsOfService = "None",
                    Contact = new Contact { Name = "Vigilans", Email = "vigilans@foxmail.com", Url = "http://history-contest.chinacloudsites.cn/wiki" }
                });

                c.DescribeAllEnumsAsStrings();

                //Set the comments path for the swagger json and ui.
                var basePath = PlatformServices.Default.Application.ApplicationBasePath;
                var xmlPath = Path.Combine(basePath, "HistoryContest.Server.xml");
                c.IncludeXmlComments(xmlPath);
            });

            // Add Cross-Origin Requests service
            services.AddCors(o => o.AddPolicy("OpenPolicy", builder =>
            {
                builder.AllowAnyOrigin()
                       .AllowAnyMethod()
                       .AllowAnyHeader();
            }));

        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, ILoggerFactory loggerFactory, UnitOfWork unitOfWork)
        {
            loggerFactory.AddConsole(Configuration.GetSection("Logging"));
            loggerFactory.AddDebug();

            if (Environment.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
                app.UseWebpackDevMiddleware(new WebpackDevMiddlewareOptions
                {
                    HotModuleReplacement = true,
                    ProjectPath = Environment.ContentRootPath + "/HistoryContest.Client"
                });
            }
            else
            {
                app.UseExceptionHandler("/Home/Error");
            }

            app.UseCors("OpenPolicy");

            // enable status code response page
            app.UseStatusCodePagesWithReExecute("/StatusCode/{0}");

            #region Static file routes
            // use wwwroot static files
            app.UseDefaultFiles();
            app.UseStaticFiles();

            // enable default url rewrite for wiki
            app.UseDefaultFiles(new DefaultFilesOptions()
            {
                FileProvider = new PhysicalFileProvider(Path.Combine(Environment.ContentRootPath, @"HistoryContest.Wiki")),
                RequestPath = new PathString("/wiki")
            });

            // use wiki static files
            app.UseStaticFiles(new StaticFileOptions()
            {
                FileProvider = new PhysicalFileProvider(Path.Combine(Environment.ContentRootPath, @"HistoryContest.Wiki")),
                RequestPath = new PathString("/wiki")
            });
            #endregion


            #region Api document routes
            // Enable middleware to serve generated Swagger as a JSON endpoint.
            app.UseSwagger(c =>
            {
                c.RouteTemplate = "api/{documentname}/swagger.json";
            });

            // Enable middleware to serve swagger-ui (HTML, JS, CSS etc.), specifying the Swagger JSON endpoint.
            app.UseSwaggerUI(c =>
            {
                c.RoutePrefix = "api";
                c.SwaggerEndpoint("/api/seu-history-contest/swagger.json", "SEU History Contest API v1");
            });
            #endregion


            #region Authentication settings
            // Use Cookie Authentication
#if NETCOREAPP2_0
            app.UseAuthentication();
#else
            app.UseCookieAuthentication(new CookieAuthenticationOptions()
            {
                AuthenticationScheme = CookieAuthenticationDefaults.AuthenticationScheme,
                LoginPath = new PathString("/Account/Login/"),
                AccessDeniedPath = new PathString("/"),
                AutomaticAuthenticate = true,
                AutomaticChallenge = true
            });
#endif

            // use sessions
            app.UseSession();
            #endregion


            #region Javascript spa routes
            app.UseMvc(routes =>
            {
                routes.MapRoute(
                    name: "default",
                    template: "{controller=Home}/{action=Index}/{id?}");

                routes.MapSpaFallbackRoute(
                    name: "spa-fallback",
                    defaults: new { controller = "Home", action = "Index" });
            });
            #endregion

            
            // Seed database
            if (!unitOfWork.DbContext.AllMigrationsApplied())
            {
                unitOfWork.DbContext.Database.Migrate();
                unitOfWork.DbContext.EnsureAllSeeded();
            }

            // flush cache
            var endpoints = RedisService.Connection.GetEndPoints();
            RedisService.Connection.GetServer(endpoints.First()).FlushAllDatabases();

            // Load cache
            var questionSeedService = new QuestionSeedService(unitOfWork);
            int scale = unitOfWork.Configuration.QuestionSeedScale;
            var questionSeeds = questionSeedService.CreateNewSeeds(scale);

            unitOfWork.Cache.QuestionSeeds().SetRange(questionSeeds, s => s.ID.ToString());
            unitOfWork.QuestionRepository.LoadQuestionsToCache();
            unitOfWork.StudentRepository.LoadStudentsToCache();
            new TestDataService(unitOfWork).SeedTestedStudents();

            syncWithDatabaseTimer = new Timer(async o =>
            {
                var _services = new ServiceCollection();
                ConfigureServices(_services);
                using (var _serviceProvider = _services.BuildServiceProvider())
                using (UnitOfWork _unitOfWork = _serviceProvider.GetService<UnitOfWork>())
                {
                    await _unitOfWork.SaveCacheToDataBase();
                    new ExcelExportService(_unitOfWork).UpdateExcelOfSchool();
                }
                GC.Collect();
                syncWithDatabaseTimer.Change((int)TimeSpan.FromMinutes(10).TotalMilliseconds, Timeout.Infinite);
            }, null, (int)TimeSpan.FromMinutes(10).TotalMilliseconds, Timeout.Infinite);
        }
    }

    internal class LocalViewEngine : IViewLocationExpander
    {
        public void PopulateValues(ViewLocationExpanderContext context)
        {
            context.Values["customviewlocation"] = nameof(LocalViewEngine);
        }

        public IEnumerable<string> ExpandViewLocations(ViewLocationExpanderContext context, IEnumerable<string> viewLocations)
        {
            return new[]
            {
             "~/HistoryContest.Server/Views/{1}/{0}.cshtml",
             "~/HistoryContest.Server/Views/Shared/{0}.cshtml"
            };
        }
    }
}
