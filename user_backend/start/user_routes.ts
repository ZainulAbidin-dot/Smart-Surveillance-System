import Route from "@ioc:Adonis/Core/Route";
import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";

import { createUserController } from "App/Controllers/Http/Api/users/createUser";
import { getUserController } from "App/Controllers/Http/Api/users/getUser";
import { loginController } from "App/Controllers/Http/Api/users/login";
import { updateUserController } from "App/Controllers/Http/Api/users/updateUser";

console.log("USER API PAGE");

Route.group(() => {
  Route.post("/user", async ({ request, response }: HttpContextContract) => {
    return await createUserController.executeImpl(request, response);
  });
  Route.get("/me", async ({ request, response }: HttpContextContract) => {
    return await getUserController.executeImpl(request, response);
  });
  Route.post(
    "/user/login",
    async ({ request, response }: HttpContextContract) => {
      return await loginController.executeImpl(request, response);
    }
  );
  Route.post(
    "/user/update",
    async ({ request, response }: HttpContextContract) => {
      return await updateUserController.executeImpl(request, response);
    }
  );
  Route.get("/check", async () => {
    return "welcome";
  });
}).prefix("/api");
