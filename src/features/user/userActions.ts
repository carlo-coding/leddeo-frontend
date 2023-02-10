import { createAsyncThunk } from "@reduxjs/toolkit";
import { enqueueSnackbar } from "notistack";
import { closeModal } from "../../components";
import { IUpdateUserPayload } from "../../models";
import { serviceGetUserInfo, serviceUpdateUserInfo } from "../../services";

export const getUser = createAsyncThunk("user/getUser", async () => {
  const [resp] = await serviceGetUserInfo();
  return resp;
});

export const updateUser = createAsyncThunk(
  "user/updateUser",
  async (payload: IUpdateUserPayload, { dispatch }) => {
    const [resp, error] = await serviceUpdateUserInfo(payload);
    if (error !== null) {
      enqueueSnackbar(error.message, { variant: "error" });
      return null;
    }

    dispatch(closeModal());
    enqueueSnackbar("Información actualizada con éxito", {
      variant: "success",
    });
    return resp;
  }
);
