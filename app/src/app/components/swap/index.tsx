import {
  Avatar,
  Button,
  Divider,
  Input,
  InputNumber,
  Modal,
  Select,
  Tooltip,
  Typography,
  notification,
} from "antd";
import React, { useEffect, useState } from "react";
import "antd/dist/reset.css";
import "./index.css";
import {
  ArrowDownOutlined,
  DownOutlined,
  SearchOutlined,
  SettingFilled,
} from "@ant-design/icons";
import axios from "axios";
import svgs from "@/app/assets/tokens";

interface CryptoData {
  currency: string;
  data: Date;
  price: number;
}
const validateInput = (input: string): boolean => {
  const numberRegex = /^[0-9]+(\.[0-9]+)?$/;
  return numberRegex.test(input);
};

const Swap: React.FC = () => {
  const [topValue, setTopValue] = useState<number | null | string>(null);
  const [bottomValue, setBottomValue] = useState<number | null | string>(null);
  const [topToken, setTopToken] = useState<string | null>("ETH");
  const [bottomToken, setBottomToken] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [current, setCurrent] = useState("");
  const [search, setSearch] = useState("");
  const [result, setResult] = useState<any>([]);
  const [calc, setCalc] = useState<number | null>(null);
  const [calcBot, setCalcBot] = useState<number | null>(null);
  const [flip, setFlip] = useState(false);
  const [api, contextHolder] = notification.useNotification();

  const openNotificationWithIcon = () => {
    api["success"]({
      message: "Success",
      description: "Your wallet has been successfully connected!.",
    });
  };

  const showModal = (value: string) => {
    setIsModalOpen(true);
    setCurrent(value);
  };

  const handleOk = () => {
    setIsModalOpen(false);
    if (current == "top") {
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    const interval = setInterval(async () => {
      const fetchData = async () => {
        try {
          const response = await axios.get(
            "https://interview.switcheo.com/prices.json"
          );
          const data = response.data;
          data.forEach((item: any) => {
            if (!flip && item.currency == topToken) {
              setCalc(item.price * Number(topValue));
            } else if (flip && item.currency == topToken) {
              setTopValue(
                calcBot && ((calcBot * 1.0002) / item.price).toFixed(3)
              );
              setCalc(calcBot && calcBot * 1.0002);
              setFlip(false);
            }
          });
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };
      fetchData();
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [topToken, topValue, flip, calcBot]);

  useEffect(() => {
    const interval = setInterval(async () => {
      const fetchData = async () => {
        try {
          const response = await axios.get(
            "https://interview.switcheo.com/prices.json"
          );
          const data = response.data;
          data.forEach((item: any) => {
            if (!flip && item.currency == bottomToken) {
              setBottomValue(calc && Number((calc / item.price).toFixed(3)));
              setCalcBot(calc && calc * 0.9998);
            }
          });
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };
      fetchData();
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [bottomToken, calc, flip]);

  const handleInputTop = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTopValue(event.target.value);
  };

  const handleInputBottom = (event: React.ChangeEvent<HTMLInputElement>) => {
    setBottomValue(event.target.value);
  };

  const handleInputSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
  };

  useEffect(() => {
    setResult(svgs);
  }, []);

  useEffect(() => {
    const filteredResult = svgs.filter(
      (x) =>
        x.name.toLowerCase().includes(search.trim().toLowerCase()) ||
        x.shortform.toLowerCase().includes(search.trim().toLowerCase())
    );
    setResult(filteredResult);
  }, [search]);

  return (
    <div style={{ width: "30rem", margin: "auto" }}>
      {contextHolder}
      <Modal
        title="Select a token"
        open={isModalOpen}
        // onOk={handleOk}
        onCancel={handleCancel}
        footer={<></>}
      >
        <div style={{ display: "flex", flexDirection: "row" }}>
          <Input
            placeholder="Search name or paste address"
            prefix={<SearchOutlined />}
            size="large"
            style={{ marginRight: "0.5rem" }}
            onChange={handleInputSearch}
          />
          <Select
            size="large"
            placeholder={
              <Avatar
                shape="square"
                style={{ backgroundColor: "#E8E8E8" }}
                src={
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 32 32"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M16.0755 0L15.87 0.699961V21.0112L16.0755 21.2168L25.4845 15.6438L16.0755 0Z"
                      fill="#70769A"
                    />
                    <path
                      d="M16.0756 0L6.66666 15.6438L16.0756 21.2168V11.3584V0Z"
                      fill="#959CBA"
                    />
                    <path
                      d="M16.0756 24.2842L15.9598 24.4257V31.661L16.0756 31.9999L25.4903 18.714L16.0756 24.2842Z"
                      fill="#71769A"
                    />
                    <path
                      d="M16.0756 32V24.2842L6.66666 18.714L16.0756 32Z"
                      fill="#959CBA"
                    />
                    <path
                      d="M16.0756 21.2167L25.4844 15.6438L16.0756 11.3584V21.2167Z"
                      fill="#555A82"
                    />
                    <path
                      d="M6.66666 15.6437L16.0755 21.2168V11.3584L6.66666 15.6437Z"
                      fill="#70769A"
                    />
                  </svg>
                }
              />
            }
          ></Select>
        </div>
        <Divider />
        <Typography.Text style={{ color: "#C6C6C6", fontSize: "1.3rem" }}>
          Popular tokens
        </Typography.Text>
        <div
          style={{ overflowY: "scroll", maxHeight: "400px", marginTop: "2rem" }}
        >
          <div>
            {result.map((x: any) => {
              return (
                <div
                  key={x.name}
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    flex: 1,
                    // margin: "1rem 0",
                    padding: "1rem 0.5rem",
                  }}
                  className="token-div"
                  onClick={() => {
                    if (current == "top") {
                      setTopToken(x.shortform);
                    } else {
                      setBottomToken(x.shortform);
                    }
                    setIsModalOpen(false);
                    setSearch("");
                  }}
                >
                  <Avatar
                    src={x.component}
                    shape="circle"
                    size="large"
                    style={{ marginRight: "1rem" }}
                  />
                  <div>
                    <div style={{ fontWeight: "bold" }}>{x.name}</div>
                    <div style={{ color: "#a39f9f" }}>{x.shortform}</div>
                  </div>
                </div>
              );
            })}
            {/* <Avatar src={} /> */}
          </div>
        </div>
      </Modal>
      <div
        style={{
          marginTop: "4rem",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <div>
          <Button type="link" style={{ color: "grey", fontWeight: "bold" }}>
            Swap
          </Button>
          <Tooltip title="Coming Soon">
            <Button type="link" style={{ color: "grey" }} disabled>
              Send
            </Button>
          </Tooltip>
          <Tooltip title="Coming Soon">
            <Button type="link" style={{ color: "grey" }} disabled>
              Buy
            </Button>
          </Tooltip>
        </div>
        <div>
          <Tooltip title="Coming Soon">
            <Button
              type="link"
              icon={<SettingFilled style={{ color: "grey" }} />}
              disabled
            ></Button>
          </Tooltip>
        </div>
      </div>
      <div
        style={{
          position: "relative",
          padding: "1rem",
          margin: "0.3rem 0rem",
          borderRadius: "10px",
          borderColor: "grey",
          borderWidth: "1px",
          backgroundColor: "#f9f9f9",
        }}
      >
        <Typography.Text style={{ color: "#aeacac" }}>You Pay</Typography.Text>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
          }}
        >
          <Input
            onChange={handleInputTop}
            placeholder="0"
            style={{
              borderWidth: 0,
              backgroundColor: "#f9f9f9",
              fontSize: "1.5rem",
            }}
            value={topValue ? topValue : undefined}
            // size="large"
          />
          <Button
            type="default"
            style={{
              backgroundColor: topToken ? "white" : "#317873",
              color: topToken ? "black" : "#F0FFFF",
              borderRadius: "30px",
              fontSize: "1.3rem",
              height: "100%",
            }}
            onClick={() => showModal("top")}
          >
            {topToken && (
              <Avatar
                src={svgs.filter((x) => x.shortform == topToken)[0].component}
                shape="circle"
                size="large"
                style={{ marginRight: "0.5rem" }}
              />
            )}
            {topToken ? topToken : "Select Token"}
            <DownOutlined />
          </Button>
        </div>
        <Typography.Text style={{ color: "#aeacac" }}>
          {calc && "$" + calc.toFixed(2)}
        </Typography.Text>
      </div>
      <div style={{ textAlign: "center" }}>
        <Button
          className="middle-button"
          type="primary"
          size="large"
          style={{
            position: "absolute",
            transform: "translate(-50%, -50%)",
            backgroundColor: "#f9f9f9",
            borderWidth: "2px",
            borderColor: "white",
            color: "grey",
            fontWeight: 600,
            zIndex: 1,
          }}
          onClick={() => {
            const currTop = topToken;
            const currBottom = bottomToken;
            const currTopValue = topValue;
            setBottomToken(currTop);
            setTopToken(currBottom);
            setBottomValue(currTopValue);
            setCalcBot(calc);
            setFlip(true);
          }}
        >
          <ArrowDownOutlined />
        </Button>
      </div>
      <div
        style={{
          position: "relative",
          padding: "1rem",
          margin: "0.3rem 0rem",
          borderRadius: "10px",
          borderColor: "grey",
          borderWidth: "1px",
          backgroundColor: "#f9f9f9",
        }}
      >
        <Typography.Text style={{ color: "#aeacac" }}>
          You Receive
        </Typography.Text>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
          }}
        >
          <Input
            onChange={handleInputBottom}
            placeholder="0"
            style={{
              borderWidth: 0,
              backgroundColor: "#f9f9f9",
              fontSize: "1.5rem",
            }}
            value={bottomValue ? bottomValue : undefined}
            // size="large"
          />
          <Button
            type="default"
            style={{
              backgroundColor: bottomToken ? "white" : "#317873",
              color: bottomToken ? "black" : "#F0FFFF",
              borderRadius: "30px",
              fontSize: "1.3rem",
              height: "100%",
            }}
            onClick={() => showModal("bottom")}
          >
            {bottomToken && (
              <Avatar
                src={
                  svgs.filter((x) => x.shortform == bottomToken)[0].component
                }
                shape="circle"
                size="large"
                style={{ marginRight: "0.5rem" }}
              />
            )}
            {bottomToken ? bottomToken : "Select Token"}
            <DownOutlined />
          </Button>
        </div>
        <Typography.Text style={{ color: "#aeacac" }}>
          {calcBot && "$" + calcBot.toFixed(2) + " ~(0.02%)"}
        </Typography.Text>
      </div>

      <Button
        type="primary"
        size="large"
        style={{
          backgroundColor: "#F0FFFF",
          color: "#317873",
          width: "100%",
          height: "4rem",
          fontSize: "1.5rem",
          fontWeight: 600,
        }}
        onClick={() => openNotificationWithIcon()}
      >
        Connect Wallet
      </Button>
      <div style={{ marginTop: "1rem", paddingLeft: "1rem" }}>
        <Typography.Text style={{ fontWeight: "500" }}>
          {bottomToken &&
            "1 " +
              bottomToken +
              " = " +
              (Number(topValue) / Number(bottomValue)).toFixed(2) +
              " " +
              topToken}
        </Typography.Text>
        <Typography.Text style={{ color: "#C6C6C6" }}>
          {calcBot && "  ($" + (calcBot / Number(bottomValue)).toFixed(2) + ")"}
        </Typography.Text>
      </div>
    </div>
  );
};

export default Swap;
