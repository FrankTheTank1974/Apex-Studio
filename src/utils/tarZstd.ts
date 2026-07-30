import { ZstdCodec } from 'zstd-codec';

export interface ArchiveFile {
  name: string;
  content: string | Uint8Array;
}

/**
 * Encodes string to UTF-8 Uint8Array
 */
function stringToBytes(str: string): Uint8Array {
  return new TextEncoder().encode(str);
}

/**
 * Creates a standard POSIX USTAR TAR archive buffer from an array of files.
 */
export function createTarArchive(files: ArchiveFile[]): Uint8Array {
  const blocks: Uint8Array[] = [];

  for (const file of files) {
    const dataBytes = typeof file.content === 'string' ? stringToBytes(file.content) : file.content;
    const header = new Uint8Array(512);

    // File name (0 - 99)
    const nameBytes = stringToBytes(file.name);
    header.set(nameBytes.subarray(0, 100), 0);

    // File mode (100 - 107) -> 0000644\0
    header.set(stringToBytes('0000644\0'), 100);

    // Owner UID (108 - 115) -> 0000000\0
    header.set(stringToBytes('0000000\0'), 108);

    // Group GID (116 - 123) -> 0000000\0
    header.set(stringToBytes('0000000\0'), 116);

    // File size in octal (124 - 135) e.g., 00000000123\0
    const sizeOctal = dataBytes.byteLength.toString(8).padStart(11, '0') + '\0';
    header.set(stringToBytes(sizeOctal), 124);

    // Modification time in octal (136 - 147)
    const mtimeOctal = Math.floor(Date.now() / 1000).toString(8).padStart(11, '0') + '\0';
    header.set(stringToBytes(mtimeOctal), 136);

    // Typeflag (156) -> '0' (regular file)
    header[156] = '0'.charCodeAt(0);

    // Magic (257 - 262) -> "ustar\0"
    header.set(stringToBytes('ustar\0'), 257);

    // Version (263 - 264) -> "00"
    header.set(stringToBytes('00'), 263);

    // Set checksum field to spaces before calculating checksum
    for (let i = 148; i < 156; i++) {
      header[i] = ' '.charCodeAt(0);
    }

    // Calculate checksum
    let checksum = 0;
    for (let i = 0; i < 512; i++) {
      checksum += header[i];
    }
    const checksumOctal = checksum.toString(8).padStart(6, '0') + '\0 ';
    header.set(stringToBytes(checksumOctal), 148);

    blocks.push(header);

    // File payload blocks
    blocks.push(dataBytes);

    // Padding to 512 boundary
    const remainder = dataBytes.byteLength % 512;
    if (remainder > 0) {
      const padding = new Uint8Array(512 - remainder);
      blocks.push(padding);
    }
  }

  // Two 512-byte zero blocks at the end of tar
  blocks.push(new Uint8Array(1024));

  // Combine blocks into one Uint8Array
  const totalLength = blocks.reduce((acc, b) => acc + b.byteLength, 0);
  const tarBuffer = new Uint8Array(totalLength);
  let offset = 0;
  for (const b of blocks) {
    tarBuffer.set(b, offset);
    offset += b.byteLength;
  }

  return tarBuffer;
}

let zstdInstance: any = null;

function getZstdSimple(): Promise<any> {
  return new Promise((resolve) => {
    if (zstdInstance) {
      return resolve(zstdInstance);
    }
    ZstdCodec.run((zstd: any) => {
      zstdInstance = new zstd.Simple();
      resolve(zstdInstance);
    });
  });
}

/**
 * Compresses project files into a `.tar.zst` binary file using Zstandard.
 */
export async function createTarZstdArchive(files: ArchiveFile[]): Promise<Uint8Array> {
  const tarBuffer = createTarArchive(files);
  try {
    const zstd = await getZstdSimple();
    const compressed = zstd.compress(tarBuffer);
    return compressed;
  } catch (err) {
    console.warn('Fallback tar output:', err);
    return tarBuffer;
  }
}

/**
 * Triggers a browser download of a .tar.zst file
 */
export async function downloadTarZstd(filename: string, files: ArchiveFile[]) {
  const zstdData = await createTarZstdArchive(files);
  const blob = new Blob([zstdData.buffer], { type: 'application/zstd' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename.endsWith('.tar.zst') ? filename : `${filename}.tar.zst`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
