import React, { useState } from "react";
import CreateTreatmentStage from "./CreateTreatmentStage";
import CreateTreatmentService from "./CreateTreatmentService";
import CreateTreatmentType from "./CreateTreatmentType";
import { Layout } from "antd";
import ManagerSidebar from "../ManagerSidebar";
const RenderCreateTreatment = () => {
  const [step, setStep] = useState(1);
  const [stageId, setStageId] = useState(null);
  const [typeId, setTypeId] = useState(null);
  const [selectedMenu, setSelectedMenu] = useState("services");

  const { Content } = Layout;
  return (
    <Layout style={{ minHeight: "100vh" }}>
      <ManagerSidebar
        collapsed={false} // Bạn có thể điều khiển trạng thái collapsed nếu cần
        onCollapse={() => {}}
        selectedMenu={selectedMenu}
        onMenuSelect={(menuKey) => setSelectedMenu(menuKey)}
      />

      <Layout style={{ marginLeft: 250 }}>
        <Content style={{ padding: "20px" }}>
          <div>
            {step === 1 && (
              <CreateTreatmentType
                onSuccess={(id) => {
                  setStageId(id);
                  setStep(2);
                }}
              />
            )}
            {step === 2 && (
              <CreateTreatmentStage
                stageId={stageId}
                onSuccess={(id) => {
                  setTypeId(id);
                  setStep(3);
                }}
              />
            )}
            {step === 3 && (
              <CreateTreatmentService
                typeId={typeId}
                onSuccess={() => alert("Tạo xong toàn bộ!")}
              />
            )}
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default RenderCreateTreatment;
