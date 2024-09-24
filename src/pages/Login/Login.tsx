import React, { useContext } from "react";
import styles from "./Login.module.css";
import {
  createSchema,
  getItemForEdit,
  sendMessage,
  setError,
  setSuccess,
} from "../../utils";
import { FormProvider, set, useForm } from "react-hook-form";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

import { GlobalStateContext } from "../../context/GlobalStateProvider";

import { setUser } from "../../services/localStorage";
import { InputSelect } from "../../components/inputs/InputSelect";
import { InputSwitch } from "../../components/inputs/InputSwitch";
import { InputRadio } from "../../components/inputs/InputRadio";
import { InputText } from "../../components/inputs/InputText";
const VITE_AUTHHEADER = process.env.VITE_AUTHHEADER; //import.meta.env;
const VITE_API_URL = process.env.VITE_API_URL; //import.meta.env;
const Login = () => {
  const { AuthData } = useContext(GlobalStateContext);

  const { fields, loginAndGetTokenUrl } = AuthData;
  const item = getItemForEdit(fields);
  const resolverSchema = Yup.object().shape(createSchema(fields));
  const methods = useForm({
    mode: "onTouched",
    resolver: yupResolver(resolverSchema),
    defaultValues: item,
  });
  const { control } = methods;

  const onSubmitUpload = methods.handleSubmit(async (data) => {
    sendMessage("showParange");
    try {
      const res = await fetch(VITE_API_URL + loginAndGetTokenUrl, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify(data),
      });
      if (res.status !== 200 && res.status !== 201) {
        const error = await res.json();
        throw error;
      }
      setSuccess("Login successful");

      const user = await res.json();
      setUser(user);
      window.location.href = "/";
    } catch (err: any) {
      console.log(err);
      setError(err.message || "an error occurred");
    } finally {
      setTimeout(() => {
        sendMessage("hideParange");
      }, 700);

      setTimeout(() => {
        setError("");
      }, 5000);
    }
  });

  return (
    <div className={styles.mainContainer}>
      <div className={styles.containerLeft}>
        <div className={styles.containerLeftInner}>
          <div className={styles.loginWrapper}>
            <div className={styles.loginTitle}>
              <span className={`${styles.title} headings-h1`}>Sign in</span>
              <span className={`${styles.text} body-l-regular`}>
                Please, enter your details to Sign in
              </span>
            </div>

            <FormProvider {...methods}>
              <form
                onSubmit={(e) => e.preventDefault()}
                noValidate
                autoComplete="new-password"
                className={styles.form}
              >
                {fields.map((field) => {
                  return (
                    <React.Fragment key={field.name}>
                      {field.type === "select" ? (
                        <InputSelect
                          {...field}
                          control={control}
                          options={field.options ? field.options : []}
                        />
                      ) : field.type === "switch" ? (
                        <InputSwitch {...field} control={control} />
                      ) : field.type === "radio" ? (
                        <InputRadio {...field} control={control} />
                      ) : (
                        <InputText {...field} />
                      )}
                    </React.Fragment>
                  );
                })}
              </form>
            </FormProvider>

            <div className={styles.loginFogot}>
              <button className="button tertiaryButton">
                <span className="body-m-medium">Forgot your password?</span>
              </button>
            </div>
          </div>
          <button
            className={`${styles.loginButton} button primaryButton`}
            onClick={onSubmitUpload}
          >
            <span className="body-l-medium">Sign in</span>
          </button>
        </div>
      </div>
      <div className={styles.containerRight}></div>
      <div className={styles.loginWrapper}></div>
    </div>
  );
};
// for register don't delete
// const formSchema = Yup.object().shape({
//   email: Yup.string()
//     .min(3)
//     .max(50)
//     .matches(
//       /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
//       "Email not valid"
//     ),

//   password: Yup.string()
//     .required("Required")
//     .min(12, "Password must be 12 characters long.")
//     .max(50, "Must be 50 characters or less.")
//     .matches(/[0-9]/, "Password must contain at least one number.")
//     .matches(/[a-z]/, "Password must contain at least one lowercase letter.")
//     .matches(/[A-Z]/, "Password must contain at least one uppercase letter.")
//     .matches(/[^\w]/, "Password must contain at least one symbol."),
//   cpassword: Yup.string()
//     .required("Confirm Password is required")

//     .oneOf([Yup.ref("password")], "Passwords do not match"),
//   confirm: Yup.boolean().oneOf(
//     [true],
//     "You must accept the terms and conditions"
//   ),
// });

export default Login;
