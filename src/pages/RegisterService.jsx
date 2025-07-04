import React from "react";
import { useRegisterLogic } from "../hooks/useRegisterLogic";
import RegisterForm from "../components/registerService/RegisterForm";
const RegisterService = () => {
  const { form, doctors, services, loading, onSubmit, onDoctorChange } =
    useRegisterLogic();

  return (
    <div className="container">
      <h1>Đăng ký khám bệnh</h1>
      <RegisterForm
        form={form}
        doctors={doctors}
        services={services}
        loading={loading}
        onSubmit={onSubmit}
        onDoctorChange={onDoctorChange}
      />
    </div>
  );
};

export default RegisterService;
