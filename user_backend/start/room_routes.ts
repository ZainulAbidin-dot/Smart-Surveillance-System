import Route from "@ioc:Adonis/Core/Route";
import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";

import { createRoomController } from "App/Controllers/Http/Api/rooms/createRoom";
import { getAllRoomsController } from "App/Controllers/Http/Api/rooms/getAllRooms";
import { getRoomController } from "App/Controllers/Http/Api/rooms/getRoom";
import { searchRoomController } from "App/Controllers/Http/Api/rooms/searchRoom";

console.log("ROOM API PAGE");

Route.group(() => {
  Route.post("/", async ({ request, response }: HttpContextContract) => {
    return await createRoomController.executeImpl(request, response);
  });
  Route.get("/", async ({ request, response }: HttpContextContract) => {
    return await getAllRoomsController.executeImpl(request, response);
  });
  Route.get(
    "/:userRoomId",
    async ({ request, response, params }: HttpContextContract) => {
      return await getRoomController.executeImpl(request, params, response);
    }
  );
  Route.post("/search", async ({ request, response }: HttpContextContract) => {
    return await searchRoomController.executeImpl(request, response);
  });
  Route.get("/check", async () => {
    return "welcome";
  });
}).prefix("/room");
