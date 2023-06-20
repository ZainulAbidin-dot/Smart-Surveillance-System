import Route from "@ioc:Adonis/Core/Route";
import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";

import { getAllNotificationsController } from "App/Controllers/Http/Api/notifications/getAllNotifications";
import { getNotificationController } from "App/Controllers/Http/Api/notifications/getNotification";

console.log("NOTIFICATION API PAGE");

Route.group(() => {
  Route.get("/", async ({ request, response }: HttpContextContract) => {
    return await getAllNotificationsController.executeImpl(request, response);
  });
  Route.get(
    "/:userNotificationId",
    async ({ request, response, params }: HttpContextContract) => {
      return await getNotificationController.executeImpl(
        request,
        params,
        response
      );
    }
  );
  Route.get("/check", async () => {
    return "welcome";
  });
}).prefix("/notification");
