import { Button, Image, Typography } from "antd";
import bg404 from "@/assets/404/404.jpg";
import dog404 from "@/assets/404/404_dog.jpg";

const { Title, Paragraph } = Typography;

const NotFound = () => {
  return (
    <div
      style={{
        backgroundImage: `url(${bg404})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "24px",
        padding: "20px",
      }}
    >
      <Image
        src={dog404}
        preview={false}
        width={400}
        height={180}
        style={{
          objectFit: "contain",
        }}
      />

      <Title
        level={2}
        style={{
          fontWeight: 700,
          color: "#fff",
          margin: 0,
        }}
      >
        Why are you here?
      </Title>

      <Paragraph
        style={{
          color: "#a8b3cf",
          fontSize: 15,
          marginTop: 0,
        }}
      >
        You're not supposed to be here.
      </Paragraph>

      <Button
        type="default"
        href="/"
        style={{
          backgroundColor: "#fff",
          borderRadius: 12,
          color: "#0e1217",
          fontSize: 15,
          fontWeight: 700,
          height: 48,
          paddingInline: 24,
        }}
      >
        GO HOME
      </Button>
    </div>
  );
};

export default NotFound;
