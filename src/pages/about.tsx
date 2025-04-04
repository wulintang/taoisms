import config from "@/config";
import { Divider, Alert, Typography } from "antd";

const HomePage = () => {
  const { Title } = Typography;

  return (
    <div
      style={{
        maxWidth: "90%",
        margin: "0 auto"
      }}
    >
      <Typography>
        <Title>关于</Title>
      </Typography>
      <Divider />
      <Alert message={`${config.TITLE} 致力于打造一个经典的虚拟ICP备案网, 申请本站ICP备案请于3天内于贵站底部悬挂 ${config.TITLE} 码，逾期将撤销并拉入申请黑名单!`} type="info" />
      <div style={{ height: "50px" }} />
      <p>
        兴汉联盟致力于打造一个经典而高效的虚拟ICP备案网络，为广大用户提供便捷、专业的备案服务。
        我们深知备案的重要性，因此特别设立了这一平台，旨在帮助各类网站顺利完成ICP备案。
        为确保申请流程的顺利进行，请您在申请本站ICP备案后，于三天内在贵站的页面底部悬挂“兴汉联盟”码。
        这不仅是对我们服务的认可，也是对您网站合规运营的保障。
        若逾期未能完成码的悬挂，您将面临申请被撤销的风险，并将被列入申请黑名单，这将对您今后的备案申请产生不利影响。
        我们真诚希望每一位用户都能充分重视这一要求，积极配合我们的工作，共同维护良好的网络环境。
        如有任何疑问或需要进一步的帮助，请随时与我们联系，我们将竭诚为您服务。
      </p>
    </div>
  );
}

export default HomePage;