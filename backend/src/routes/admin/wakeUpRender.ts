 import axios from "axios";

const wakeUpRender = async () => {
 
    const response = await axios.post('https://sentiment-analysis-main.onrender.com/analysis', {
      comment: "Warm up request"
    });
    console.log("✅ Warm-up call sent successfully");
 
};

 
// Call this once when server st
export default wakeUpRender;
