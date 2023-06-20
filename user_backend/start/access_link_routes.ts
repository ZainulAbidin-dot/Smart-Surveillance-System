import Route from "@ioc:Adonis/Core/Route";
import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";

import { updateAccessLinkController } from "App/Controllers/Http/Api/access_links/updateAccessLink";
import { createAccessLinkController } from "App/Controllers/Http/Api/access_links/createAccessLink";
import { getAllAccessLinkController } from "App/Controllers/Http/Api/access_links/getAllAccessLink";
import { getAccessLinkController } from "App/Controllers/Http/Api/access_links/getAccessLink";

console.log("ACCESS LINK API PAGE");

Route.group(() => {
  Route.post("/", async ({ request, response }: HttpContextContract) => {
    return await createAccessLinkController.executeImpl(request, response);
  });
  Route.post("/update", async ({ request, response }: HttpContextContract) => {
    return await updateAccessLinkController.executeImpl(request, response);
  });
  Route.get("/", async ({ request, response }: HttpContextContract) => {
    return await getAllAccessLinkController.executeImpl(request, response);
  });
  Route.get(
    "/:deviceId",
    async ({ request, params, response }: HttpContextContract) => {
      return await getAccessLinkController.executeImpl(
        request,
        params,
        response
      );
    }
  );
  Route.get("/check", async () => {
    return "welcome";
  });
}).prefix("/access");
