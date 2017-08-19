using System;
using System.Collections.Generic;
using System.Linq;
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

namespace HistoryContest.Server
{
    public class Startup
    {
        public Startup(IHostingEnvironment env)
        {
#if DEBUG && !NETCOREAPP2_0
            env.EnvironmentName = "Development";
#endif

#if !NETCOREAPP2_0
            if (!Program.FromMain && env.IsDevelopment())
            {
                env.ContentRootPath = Path.Combine(env.ContentRootPath, "..");
                env.WebRootPath = Path.Combine(env.ContentRootPath, "wwwroot");
            }
#endif
            var builder = new ConfigurationBuilder()
                .SetBasePath(Path.Combine(env.ContentRootPath, env.IsDevelopment() ? "HistoryContest.Server" : ""))
                .AddJsonFile("appsettings.json", optional: true, reloadOnChange: true)
                .AddJsonFile($"appsettings.{env.EnvironmentName}.json", optional: true)
                .AddEnvironmentVariables();
            Configuration = builder.Build();
        }

        public IConfigurationRoot Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            // Add Database Services
            services.AddDbContext<ContestContext>(options =>
                options.UseSqlServer(Configuration.GetConnectionString("DefaultConnection")));

            // Add mvc framework services.
#if DEBUG
            services.AddMvc().AddRazorOptions(options =>
            {
                options.ViewLocationExpanders.Clear();
                options.ViewLocationExpanders.Add(new MyViewEngine());
            });
#else
            services.AddMvc();
#endif

            // Adds a default in-memory implementation of IDistributedCache.
            services.AddDistributedMemoryCache();



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

#else
            services.AddAuthentication(options => options.SignInScheme = CookieAuthenticationDefaults.AuthenticationScheme);
#endif

            services.AddSession(options =>
            {
                options.IdleTimeout = TimeSpan.FromMinutes(30);
#if NETCOREAPP2_0
                options.Cookie.Name = "HistoryContest.Cookie.Session";
                // options.Cookie.Domain = "";
                options.Cookie.Path = "/";
                options.Cookie.HttpOnly = true;
                // options.Cookie.SameSite = SameSiteMode.Lax;
                // options.Cookie.SecurePolicy = CookieSecurePolicy.Always;
#else
                options.CookieName = "HistoryContest.Cookie.Session";
                // options.CookieDomain = "";
                options.CookiePath = "/";
                options.CookieHttpOnly = true;
                // options.CookieSameSite = SameSiteMode.Lax;
                // options.CookieSecure = CookieSecurePolicy.Always;
#endif
            });

            // Add Unit of work service
            services.AddScoped<UnitOfWork>();

            // Add Account service
            services.AddScoped<AccountService>();

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

                //Set the comments path for the swagger json and ui.
                var basePath = PlatformServices.Default.Application.ApplicationBasePath;
                var xmlPath = Path.Combine(basePath, "HistoryContest.Server.xml");
                c.IncludeXmlComments(xmlPath);
            });
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env, ILoggerFactory loggerFactory, ContestContext context)
        {
            loggerFactory.AddConsole(Configuration.GetSection("Logging"));
            loggerFactory.AddDebug();

            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
                app.UseWebpackDevMiddleware(new WebpackDevMiddlewareOptions
                {
                    HotModuleReplacement = true,
                    ProjectPath = env.ContentRootPath + "/HistoryContest.Client"
                });
            }
            else
            {
                app.UseExceptionHandler("/Home/Error");
            }

            #region Static file routes
            // use wwwroot static files
            app.UseDefaultFiles();
            app.UseStaticFiles();

            // enable default url rewrite for wiki
            app.UseDefaultFiles(new DefaultFilesOptions()
            {
                FileProvider = new PhysicalFileProvider(Path.Combine(env.ContentRootPath, @"HistoryContest.Wiki")),
                RequestPath = new PathString("/wiki")
            });

            // use wiki static files
            app.UseStaticFiles(new StaticFileOptions()
            {
                FileProvider = new PhysicalFileProvider(Path.Combine(env.ContentRootPath, @"HistoryContest.Wiki")),
                RequestPath = new PathString("/wiki")
            });
            #endregion


            #region Api document routes
            // Enable middleware to serve generated Swagger as a JSON endpoint.
            app.UseSwagger();

            // Enable middleware to serve swagger-ui (HTML, JS, CSS etc.), specifying the Swagger JSON endpoint.
            app.UseSwaggerUI(c =>
            {
                c.SwaggerEndpoint("/swagger/seu-history-contest/swagger.json", "SEU History Contest API v1");
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

            DbInitializer.Initialize(context);
        }
    }

#if DEBUG
    public class MyViewEngine : IViewLocationExpander
    {
        public void PopulateValues(ViewLocationExpanderContext context)
        {
            context.Values["customviewlocation"] = nameof(MyViewEngine);
        }

        public IEnumerable<string> ExpandViewLocations(
             ViewLocationExpanderContext context, IEnumerable<string> viewLocations)
        {
            return new[]
            {
             "~/HistoryContest.Server/Views/{1}/{0}.cshtml",
             "~/HistoryContest.Server/Views/Shared/{0}.cshtml"
            };
        }
    }
#endif
}
