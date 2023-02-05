using SignalRChat.Hubs;
using static System.Net.WebRequestMethods;
using Models;
using SignalRChat.Database;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddRazorPages();
//builder.Services.AddSignalR().AddAzureSignalR("Endpoint = https://warmup-b-signalr.service.signalr.net;AccessKey=ZyTefs2p2hCFkYgTdyj2gFcvojWX6A8isww52NZmqZU=;Version=1.0;");
builder.Services.AddSignalR();

builder.Services.Configure<DbSettings>(
builder.Configuration.GetSection("Database"));

builder.Services.AddSingleton<DatabaseManager>();
builder.Services.AddCors(options =>
{
    options.AddPolicy(name: "CorsPolicyAllHosts",
        builder =>
        {
            builder.AllowAnyHeader()
                   .AllowAnyMethod()
                   .AllowAnyOrigin();
        });
});

var app = builder.Build();

if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Error");
    app.UseHsts();

  
}

app.UseHttpsRedirection();
app.UseStaticFiles();
//app.UseCors("CorsPolicyAllHosts");

app.UseRouting();

app.UseAuthorization();

app.MapRazorPages();
app.MapHub<ChatHub>("/chatHub");

app.Run();

