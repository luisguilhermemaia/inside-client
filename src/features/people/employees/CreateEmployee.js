import React from 'react';
import { Steps, Button, message } from 'antd'; //eslint-disable-line

import { Step1Form, Step2Form, Step3Form, Step4Form } from './components/index';

import './createEmployee.css';

const { Step } = Steps;

const steps = [
  {
    title: 'Informações Pessoais',
    key: 'personalData',
    content: Step1Form,
  },
  {
    title: 'Endereço',
    key: 'address',
    content: Step2Form,
  },
  {
    title: 'Contatos',
    key: 'contacts',
    content: Step3Form,
  },
  {
    title: 'Documentação',
    key: 'documentation',
    content: Step4Form,
  },
];

class CreateEmployee extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      currentStep: 0,
      employee: {
        personalData: {
          gender: 'masculino',
          maritalStatus: 'solteiro',
        },
        address: {},
        contacts: {},
        documentation: {},
      },
    };

    this.formChildren = {};

    this.renderItem = this.renderItem.bind(this);
    this.next = this.next.bind(this);
    this.previous = this.previous.bind(this);
  }

  next(employee) {
    const currentStep = this.state.currentStep + 1;
    this.setState({ employee, currentStep });
  }

  previous() {
    const currentStep = this.state.currentStep - 1;
    this.setState({ currentStep });
  }

  finish(employee) {
    this.setState({ employee });
    message.success('Dados salvos com sucesso!');
  }

  validateAndMove(form, currentStep, nextStep) {
    form.validateFields(error => {
      if (!error) {
        this.moveToStep(form, currentStep, nextStep);
      } else {
        const { title: nextStepTitle } = steps[nextStep];
        message.warn(`Ainda não é possível ir para ${nextStepTitle}.`);
      }
    });
  }

  moveToStep(form, currentStep, nextStep) {
    const { key } = steps[currentStep];
    const employee = {
      ...this.state.employee,
      [key]: form.getFieldsValue(),
    };

    this.setState({ employee, currentStep: nextStep });
  }

  changeStep(event, nextStep) {
    const { currentStep } = this.state;
    const { props: { form } } = this.formChildren[currentStep];

    switch (true) {
    case nextStep <= currentStep: {
      this.moveToStep(form, currentStep, nextStep);
      break;
    }

    case nextStep === currentStep + 1: {
      this.validateAndMove(form, currentStep, nextStep);
      break;
    }

    case nextStep > currentStep + 1: {
      const { title: nextStepTitle } = steps[nextStep];
      message.warn(`Ainda não é possível ir para ${nextStepTitle}.`);
      break;
    }

    default:
    }
  }

  renderItem() {
    const { content: StepForm } = steps[this.state.currentStep];
    const { currentStep } = this.state;

    const stepProps = {
      currentStep,
      maxStep: steps.length - 1,
      employee: this.state.employee,
      nextCallback: this.next.bind(this),
      previousCallback: this.previous.bind(this),
      finishCallback: this.finish.bind(this),
    };

    return (
      <StepForm
        {...stepProps}
        onRef={ref => {
          this.formChildren[currentStep] = ref;
        }}
      />
    );
  }

  render() {
    const { currentStep } = this.state;

    return (
      <div>
        <Steps current={currentStep}>
          {steps.map((item, index) => (
            <Step
              onClick={event => this.changeStep(event, index)}
              style={{ cursor: 'pointer' }}
              key={item.title}
              title={item.title}
            />
          ))}
        </Steps>

        <div className="steps-content">{this.renderItem()}</div>
      </div>
    );
  }
}

export default CreateEmployee;
