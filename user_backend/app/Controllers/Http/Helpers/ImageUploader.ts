import Application from "@ioc:Adonis/Core/Application";
export default class ImageUploader {
  public static async upload(file: any, path: any) {
    try {
      const updatedFileName = (new Date().toISOString() + file.clientName)
        .replace(/[\/|\\:*?"<>/\s/]/g, "")
        .toLowerCase();
      await file.move(Application.tmpPath(path), {
        name: updatedFileName,
        overwrite: true, // overwrite in case of conflict
      });
      let obj = {
        filePath: "/" + path + "/" + updatedFileName,
        status: true,
      };
      return obj;
    } catch (e) {
      console.log(e.message);

      const output = Object.values(e.message).toString();
      // const responseData = await this.successResponseParser(false, e.message, true);
      // return response.status(responseData.code).send(responseData);
    }
  }
}
