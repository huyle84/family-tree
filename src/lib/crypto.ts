export async function generateAesKey() {
  return await window.crypto.subtle.generateKey(
    {
      name: "AES-GCM",
      length: 256,
    },
    true,
    ["encrypt", "decrypt"]
  );
}

export async function encryptFile(file: File, key: CryptoKey): Promise<{ encryptedBlob: Blob; iv: Uint8Array }> {
  // Sinh Initialization Vector ngẫu nhiên
  const iv = window.crypto.getRandomValues(new Uint8Array(12));
  
  // Đọc file thành ArrayBuffer
  const arrayBuffer = await file.arrayBuffer();
  
  // Mã hóa
  const cipherBuffer = await window.crypto.subtle.encrypt(
    {
      name: "AES-GCM",
      iv: iv,
    },
    key,
    arrayBuffer
  );
  
  const encryptedBlob = new Blob([cipherBuffer], { type: "application/octet-stream" });
  
  return { encryptedBlob, iv };
}

export async function exportKeyToString(key: CryptoKey): Promise<string> {
  const exported = await window.crypto.subtle.exportKey("jwk", key);
  return JSON.stringify(exported);
}
