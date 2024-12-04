import { sendMessage, setError, setSuccess } from "./sendMessage";

export const createAnyEntity = async (
  data: any,
  service: any,
  message?: string,
  serviceOptions?: any
) => {
  sendMessage("showParange");
  try {
    // console.log(message);
    const res = await service.createOne(data, serviceOptions);
    // this reload event from initdata for this service and was set while servoce was created in the service package
    if (service.reloadEvents && service.reloadEvents.create) {
      sendMessage(service.reloadEvents.create);
    }
    setSuccess(message || "Created successfully");
  } catch (err: any) {
    console.log(err);
    setError(err.message || "an error occurred");
    throw err;
  } finally {
    sendMessage("hideParange");
    setTimeout(() => {
      setSuccess("");
      setError("");
    }, 5000);
  }
};
export const updateAnyEntity = async (
  id: string,
  data: any,
  service: any,
  message?: string,
  serviceOptions?: any
) => {
  sendMessage("showParange");
  try {
    const res = await service.updateOne(id, data, serviceOptions);
    if (service.reloadEvents && service.reloadEvents.update) {
      sendMessage(service.reloadEvents.update);
    }
    setSuccess(message || "Updated successfully");
  } catch (err: any) {
    console.log(err);
    setError(err.message || "an error occurred");
    throw err;
  } finally {
    sendMessage("hideParange");
    setTimeout(() => {
      setSuccess("");
      setError("");
    }, 5000);
  }
};
export const deleteAnyEntity = async (
  id: string,
  service: any,
  message?: string
) => {
  sendMessage("showParange");
  try {
    const res = await service.deleteOne(id);
    if (service.reloadEvents && service.reloadEvents.delete) {
      setTimeout(() => {
        sendMessage(service.reloadEvents.delete);
      }, 100);
    }
    setSuccess(message || "Deleted successfully");
  } catch (err: any) {
    console.log(err);
    setError(err.message || "an error occurred");
    throw err;
  } finally {
    sendMessage("hideParange");
    setTimeout(() => {
      setSuccess("");
      setError("");
    }, 5000);
  }
};
export const getAnyEntity = async (
  id: string,
  service: any,
  message?: string
) => {
  sendMessage("showParange");
  try {
    const res = await service.getOne(id);
    setSuccess(message || "Get successfully");
    return res;
  } catch (err: any) {
    console.log(err);
    setError(err.message || "an error occurred");
    throw err;
  } finally {
    sendMessage("hideParange");
    setTimeout(() => {
      setSuccess("");
      setError("");
    }, 5000);
  }
};
