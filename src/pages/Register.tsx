import Button from "../components/ui/Button";
import Input from "../components/ui/Input";

  // Renders
const  RegisterPage=()=>{
  

  return (
    <div className="max-w-md mx-auto">
      
      <h2 className="mb-4 text-3xl font-semibold text-center">
        Register to get access!
      </h2>
      
      <form className="space-y-4">
        <Input placeholder="Username" />
        <Input placeholder="Emaill address" />
        <Input placeholder="Password" />

       <Button fullWidth>REister</Button>

      </form>
    </div>
  );
};

export default RegisterPage;
