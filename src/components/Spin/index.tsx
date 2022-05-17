import React from "react";
import styled from "styled-components";
import Loading from "../Loading";

const SpinContainer = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
`;

const LoadingWrap = styled.div`
  width: 100%;
  height: 100%;
  position: absolute;
  background: #130f1d;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 3;
`;

const Spin = ({ children = null, loading = false }) => {
  return (
    <SpinContainer>
      {loading && (
        <LoadingWrap>
          <Loading width={40} color={"#6F5AFF"} />
        </LoadingWrap>
      )}

      {children}
    </SpinContainer>
  );
};

export default Spin;
