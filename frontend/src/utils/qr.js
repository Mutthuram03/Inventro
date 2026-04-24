/**
 * Utility for QR code data encoding and decoding in Inventro.
 */

/**
 * Encodes product data into the standard system QR format.
 * @param {Object} product - The product object.
 * @returns {string} - JSON string for the QR code.
 */
export const encodeProductQR = (product) => {
  if (!product || !product.id) return '';
  
  const qrData = {
    id: product.id,
    name: product.name || 'Unknown',
    source: 'inventro'
  };
  
  return JSON.stringify(qrData);
};

/**
 * Decodes and validates QR data.
 * @param {string} rawData - Raw data from scanner.
 * @returns {Object|null} - Decoded object or null if invalid.
 */
export const decodeProductQR = (rawData) => {
  try {
    const data = JSON.parse(rawData);
    
    // Basic validation
    if (data && data.id && data.source === 'inventro') {
      return data;
    }
    
    // Fallback if source is missing but id exists (backward compatibility or generic)
    if (data && data.id) {
      return data;
    }
    
    return null;
  } catch (e) {
    // Not a JSON QR
    return null;
  }
};
