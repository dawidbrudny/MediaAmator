import { useState, forwardRef, type ComponentPropsWithRef } from 'react';

type SelectorProps = {
    options: string[];
} & ComponentPropsWithRef<'div'>;


const Selector = ({ options }: SelectorProps, ref) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(options[0]);

  return (
    <CustomSelectContainer>
        <CustomSelectValue ref={ref} onClick={() => setIsOpen(!isOpen)}>
        {selectedOption}
        </CustomSelectValue>
        {isOpen && (
            <CustomOptions>
            {options.map(option => (
                <CustomOption key={option} onClick={() => {
                    setSelectedOption(option);
                    setIsOpen(false);
                }}>
                    {option}
                </CustomOption>
            ))}
            </CustomOptions>
        )}
    </CustomSelectContainer>
  );
};

//  --- Styling ---
import styled from 'styled-components';

const CustomSelectContainer = styled.div`
  position: relative;
  width: 500px;
`;

const CustomSelectValue = styled.div`
  padding: 10px;
  border: 1.5px solid black;
  font-weight: bold;
  cursor: pointer;
`;

const CustomOptions = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  border: 1px solid lightgray;
  background-color: white;
  z-index: 1;
`;

const CustomOption = styled.div`
  padding: 10px;
  cursor: pointer;
  &:hover {
    background-color: rgb(255, 243, 215);
  }
`;

export default Selector;