export const generateVerification = (length =6)=>{
  const character = 'ABCDEFGHIJKLMNOPQRSTUVWZYZ0123456789';
  let verificationCode =  "";
  const characterLength = character.length;
  for(let i = 0;i<length;i++){
    verificationCode += character.charAt(Math.floor(Math.random()*characterLength))
  }
  return verificationCode;
}
