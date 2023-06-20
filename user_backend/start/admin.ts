import Route from "@ioc:Adonis/Core/Route";
import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
const admin = "App/Controllers/Http/Admin";

Route.group(() => {
  //--------------------------- Auth Routes--------------------------------
  Route.post("/post-login", "AuthController.login").as("auth");

  Route.get("/login", "AuthController.viewLoginPage").as("view-login");

  Route.get("/logout", "AuthController.logout").as("logout");
  // ----------------------------Auth Routes End-----------------------------
})
  .prefix("/admin")
  .namespace(admin);

Route.get("/dashboard", "GeneralController.viewDashBoard")
  .as("view-dashboard")
  .prefix("/admin")
  .namespace(admin);
