import CanteenForm from '../CanteenForm';

export default function CanteenFormExample() {
  const handleSubmit = async (data: any) => {
    console.log('Form submitted with data:', data);
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
  };

  return <CanteenForm onSubmit={handleSubmit} />;
}