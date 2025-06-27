import React, { useContext, useState } from "react";
import CreateTreatmentStage from "./CreateTreatmentStage";
import CreateTreatmentService from "./CreateTreatmentService";
import CreateTreatmentType from "./CreateTreatmentType";
import { Layout } from "antd";
import ManagerSidebar from "../ManagerSidebar";

import Step1 from "./CreateTreatmentType";
import Step2 from "./CreateTreatmentStage";
import { managerService } from "../../../service/manager.service";
import { NotificationContext } from "../../../App";
import { useNavigate } from "react-router-dom";
import { path } from "../../../common/path";

const RenderCreateTreatment = () => {
  const { showNotification } = useContext(NotificationContext);
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [treatmentData, setTreatmentData] = useState({
    name: "",
    description: "",
    treatmentStages: [],
  });
  const [createdTypeId, setCreatedTypeId] = useState(null);
  const nextStep = () => setStep((s) => s + 1);
  const prevStep = () => setStep((s) => s - 1);

  const updateTreatmentType = (typeData) => {
    setTreatmentData((prev) => ({ ...prev, ...typeData }));
    nextStep();
  };

  const updateStages = (stages) => {
    setTreatmentData((prev) => ({ ...prev, treatmentStages: stages }));
  };

  const submitTreatmentAndStages = async () => {
    try {
      const res = await managerService.createTreatType(treatmentData);
      showNotification("Tạo liệu trình điều trị thành công!", "success");
      navigate(path.managerServices);
    } catch (err) {
      console.error("Lỗi tạo loại điều trị:", err);
      showNotification("Lỗi tạo loại điều trị", "error");
      console.log(treatmentData);
    }
  };
  return (
    <>
      {step === 1 && (
        <Step1 defaultValues={treatmentData} onNext={updateTreatmentType} />
      )}
      {step === 2 && (
        <Step2
          initialStages={treatmentData.treatmentStages}
          onStagesChange={updateStages}
          onBack={prevStep}
          onSubmit={submitTreatmentAndStages}
        />
      )}
    </>
  );
};

export default RenderCreateTreatment;
