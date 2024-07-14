import { 
    type ComponentPropsWithoutRef,
    type FormEvent,
    forwardRef,
    useRef,
    useImperativeHandle
} 
from 'react';

import styled from 'styled-components';

export type FormHandle = {
    clear: () => void;
}

type FormProps = {
    onSave: (value: unknown) => void;
} & ComponentPropsWithoutRef<'form'>;

const Form = forwardRef<FormHandle, FormProps>(({ onSave, children, ...props }, ref) => {
    const formRef = useRef<HTMLFormElement>(null);

    useImperativeHandle(ref, () => ({
        clear: () => formRef.current?.reset()
    }));

    function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const data = Object.fromEntries(formData);
        onSave(data);
    }

    return (
        <FormContainer ref={formRef} {...props} onSubmit={handleSubmit}>
            {children}
        </FormContainer>
    );
});

const FormContainer = styled.form`
    max-width: 400px;
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    background-color: white;
    padding: 30px 0;
    border: 1.5px solid black;

    > * {
        flex-basis: 100%;
    }

    > button {
        flex-basis: 30%;
        width: 50px;
        height: 35px;
        margin-top: 20px;
    }
`;

export default Form;
