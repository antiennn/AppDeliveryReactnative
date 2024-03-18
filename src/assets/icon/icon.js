import React from "react";
import {
  User,
  Lock,
  Eye,
  EyeSlash,
  Sms,
  UserEdit,
  Call,
  Personalcard,
  Send2,
  Notification,
  SearchNormal1,
  Scanner,
  Microphone2,
  Home2,
  Edit2,
  TagUser,
  CloseCircle,
  Box,
  BoxTick
} from "iconsax-react-native";

const Icon = ({ name }) => {
  switch (name) {
    case "user":
      return <User size="32" color="#697689" />;
    case "lock":
      return <Lock size="32" color="#697689" />;
    case "eye":
      return <Eye size="32" color="#697689" />;
    case "eyeslash":
      return <EyeSlash size="32" color="#697689" />;
    case "email":
      return <Sms size="32" color="#697689" />;
    case "infouser":
      return <UserEdit size="32" color="#697689" />;
    case "call":
      return <Call size="32" color="#697689" />;
    case "identitycard":
      return <Personalcard size="32" color="#697689" />;
    case "location":
      return <Send2 size="16" color="#fff" variant="Bold"/>
    case "notification":
      return <Notification size="30" variant="Bold" color="#000" />;
    case "search":
      return <SearchNormal1 size="28" color="#5e46a3" />;
    case "searchmap":
      return <SearchNormal1 size="22" color="gray" />;
    case "scan":
      return <Scanner size="24" color="#fff" />;
    case "mic":
      return <Microphone2 size="22" color="gray"/>
    case "home":
      return <Home2 size="28" color="gray"/>
    case "edit":
      return <Edit2 size="28" color="gray"/>
    case "receiver":
      return <TagUser size="28" color="gray"/>
    case "close":
      return <CloseCircle size="22" color="gray"/>
    case "box":
      return <Box size="28" color="gray"/>
    case "boxtick":
      return <BoxTick size="28" color="black"/>
    default:
      break;
  }
};

export default Icon;
