import React, { useContext, useEffect, useState } from "react";
import Button from "~/components/Button/Button";
import InputCustom from "~/components/InputCustom/InputCustom";
import HeaderSidebar from "../../components/HeaderSidebar";
import { useFormik } from "formik";
import * as Yup from "yup";
import { ToastifyContext } from "~/contexts/ToastifyProvider";
import { authService } from "~/apis/authService";
import { cartService } from "~/apis/cartService";
import { StoreContext } from "~/contexts/StoreProvider";

const SignInSidebar = ({ titleSidebar, setIsOpenSidebar }) => {
  const { setUserInfo, setListItemCart, setCountItem, totalItem } =
    useContext(StoreContext);

  const { toast } = useContext(ToastifyContext);
  const [title, setTitle] = useState(titleSidebar);
  const [isRegister, setIsRegister] = useState(false);
  const formik = useFormik({
    initialValues: {
      email: "",
      username: "",
      password: "",
      cfmpassword: ""
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email("Invalid email!")
        .when([], {
          is: () => isRegister,
          then: (schema) => schema.required("Email is required!"),
          otherwise: (schema) => schema.notRequired()
        }),
      username: Yup.string().when([], {
        is: () => isRegister,
        then: (schema) => schema.required("Username is required!"),
        otherwise: (schema) => schema.required("Username is required!")
      }),

      password: Yup.string()
        .min(6, "Password must be at least 6 characters!")
        .required("Password is required!"),
      cfmpassword: Yup.string().when("password", (password, schema) =>
        isRegister
          ? schema.oneOf([Yup.ref("password"), null], "Password must match")
          : schema.notRequired()
      )
    }),
    onSubmit: async (values) => {
      const { email, password, username } = values;

      if (isRegister) {
        await authService
          .createNewUser({ email, password, username })
          .then((res) => {
            console.log(res);
            setUserInfo(res.data.data);
            toast.success(res.data.data.message);
            setTimeout(() => {
              setIsOpenSidebar(false);
            }, 500);
          })
          .catch((err) => {
            console.log("loi roi");
            toast.error("Login failed!");
          });
      } else {
        await authService
          .loginAccount({ username, password })
          .then((res) => {
            console.log(res);
            setUserInfo(res.data.data);
            // lưu userInfo vào localStorage (chuyển sang string)
            localStorage.setItem("userInfo", JSON.stringify(res.data.data));
            toast.success(res.data.message);
            setTimeout(() => {
              // After successful login: fetch user's cart from API and populate store
              const userId = res.data?.data?.customerCode;
              if (userId) {
                cartService
                  .getAllCart(res.data.data)
                  .then((cartRes) => {
                    setListItemCart(cartRes.data.data);
                    // update cart count
                    setCountItem(totalItem(cartRes.data.data));
                    setIsOpenSidebar(false);
                  })
                  .catch((err) => {
                    console.error("Error fetching cart after login:", err);
                    setIsOpenSidebar(false);
                  });
              } else {
                setIsOpenSidebar(false);
              }
            }, 500);
          })
          .catch((err) => {
            toast.error("Login failed!");
          });
      }

      formik.resetForm();
    }
  });
  useEffect(() => {
    if (isRegister) {
      setTitle({ ...title, title: "CREATE YOUR ACCOUNT" });
    } else if (!isRegister) {
      setTitle({ ...title, title: "SIGN IN" });
    }
  }, [isRegister]);

  return (
    <div className="p-5 space-y-5">
      {/* header sidebar */}
      <HeaderSidebar titleSidebar={title} />
      <form onSubmit={formik.handleSubmit}>
        <div className="w-full">
          {isRegister && (
            <InputCustom
              id="email"
              label={"Email"}
              type={"text"}
              require={true}
              formik={formik}
            />
          )}

          <InputCustom
            id="username"
            label={"Username"}
            type={"text"}
            require={true}
            formik={formik}
          />
          <InputCustom
            id="password"
            label={"Password"}
            type={"password"}
            require={true}
            formik={formik}
          />

          {isRegister && (
            <InputCustom
              id="cfmpassword"
              label={"Comfirm password"}
              type={"password"}
              require={true}
              formik={formik}
            />
          )}
        </div>

        <div className="mt-10 w-full text-center space-y-3">
          {!isRegister && (
            <div className="text-left space-x-3">
              <input type="checkbox" name="" id="" />
              <label>Remember me</label>
            </div>
          )}

          <div>
            <Button
              type="submit"
              content={isRegister ? "CREATE AN ACCOUNT" : "LOGIN"}
              w="w-full"
            />
          </div>
          <div
            onClick={() => {
              setIsRegister(!isRegister);
              formik.resetForm();
            }}
          >
            <Button
              content={`${isRegister ? "LOGIN" : "SIGN UP"}`}
              w="w-full"
              hoverTextColor={"hover:text-white"}
              bgColor={"bg-transparent"}
              hoverBgColor={"hover:bg-black"}
              textColor={"text-black"}
            />
          </div>
        </div>
        {!isRegister && (
          <p className="text-third mt-3 text-center cursor-pointer">
            Lost your password?
          </p>
        )}
      </form>
    </div>
  );
};

export default SignInSidebar;
