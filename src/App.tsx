import React, { useState } from "react";
import { Button, Input } from "antd";
import "./App.scss";

function App() {
  const [text, setText] = useState<string>("");
  const [firstNum, setFirstNum] = useState<number | undefined>(undefined);
  const [secondNum, setSecondNum] = useState<number | undefined>(undefined);
  const [encryptedMes, setEncryptedMes] = useState<string>("");
  const [decryptedText, setDecryptedText] = useState<string>("");

  function openKey(): { e: bigint; n: bigint; f: bigint } {
    let primeNums: bigint[] = [];
    let n = BigInt(0);
    let f = BigInt(0);
    let e = BigInt(0);
    let isPrime = false;
    if (firstNum && secondNum) {
      n = BigInt(firstNum) * BigInt(secondNum);
      f = (BigInt(firstNum) - BigInt(1)) * (BigInt(secondNum) - BigInt(1));
      for (let i = 2; i < f; i++) {
        isPrime = true;
        for (let j = 2; j < i; j++) if (i % j === 0) isPrime = false;
        if (isPrime) {
          primeNums = [...primeNums, BigInt(i)];
        }
      }
      e = primeNums.find(p => p > BigInt(1) && f % p !== BigInt(0)) || BigInt(0);
    }

    return { e, n, f };
  }

  function modInverse(e: bigint, f: bigint): bigint {
    
    let d = BigInt(0);
    let newD = BigInt(1);
    let r = f;
    let newR = e;

    while (newR !== BigInt(0)) {
      const quotient = r /newR;
      [d, newD] = [newD, d - quotient * newD];
      [r, newR] = [newR, r - quotient * newR];
    }

    if (d < BigInt(0)) d = d + f;
    return d;
  }

  function encrypt() {
    const { e, n } = openKey();
    const cipherTextArray = text.split("").map(char => {
      const m = BigInt(char.charCodeAt(0));
      return (m ** e % n).toString();
    });
    setEncryptedMes(cipherTextArray.join(" "));
  }

  function decrypt() {
    const { n, f, e } = openKey();
    const d = modInverse(e, f);
    const decryptedMessageArray = encryptedMes.split(" ").map(cipherChar => {
      const c = BigInt(cipherChar);
      const m = c ** d % n;
      return String.fromCharCode(Number(m));
    });
    setDecryptedText(decryptedMessageArray.join(""));
  }

  return (
    <div className="App">
      <div className="inputs">
        <Input
          onChange={e => setText(e.target.value)}
          value={
            text}
          placeholder="Text"
        />
        <Input
          onChange={e => setFirstNum(parseInt(e.target.value))}
          value={firstNum}
          placeholder="Prime number 1"
          type="number"
        />
        <Input
          onChange={e => setSecondNum(parseInt(e.target.value))}
          value={secondNum}
          placeholder="Prime number 2"
          type="number"
        />
        <Input value={encryptedMes} readOnly type="text" />
        <Button onClick={encrypt}>Encrypt</Button>
        <Input value={decryptedText} readOnly type="text" />
        <Button onClick={decrypt}>Decrypt</Button>
      </div>
    </div>
  );
}

export default App;
