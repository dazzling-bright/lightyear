import React from "react";
import { Flex } from "@chakra-ui/react";
import { motion } from "framer-motion";

const MotionDiv = motion.div;

const Loading = () => {
  return (
    <Flex align="center" justify="center" h="200px" bg="transparent">
      <MotionDiv
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        style={{
          width: "40px",
          height: "40px",
          border: "2px solid rgba(244,124,32,0.2)",
          borderTopColor: "#F47C20",
          borderRadius: "50%",
        }}
      />
    </Flex>
  );
};

export default Loading;
