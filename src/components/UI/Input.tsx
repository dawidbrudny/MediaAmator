import { type ComponentPropsWithRef, forwardRef } from "react";

import styled from "styled-components";

type InputProps = {
  label?: string;
  id: string;
} & ComponentPropsWithRef<"input">;

const Input = forwardRef<HTMLInputElement, InputProps>(({ label, id, ...props }, ref) => {
  return (
    <>
      <label htmlFor={id}>{label}</label>
      <InputContainer id={id} name={id} {...props} ref={ref} />
    </>
  );
});

const InputContainer = styled.input`
  padding: 5px;
  border: 1.5px solid black;
  font-weight: bold;
  font-size: 15px;
  letter-spacing: 1px;
  color: rgb(61, 61, 61);

  &:focus {
    outline: none;
    border: 2px solid rgb(150, 0, 0);
    background-color: rgb(255, 243, 215);
  }
`;

export default Input;
