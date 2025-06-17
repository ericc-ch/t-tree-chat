export async function compress(
  jsonString: string,
  fileName: string,
): Promise<File> {
  try {
    const jsonStream = new ReadableStream({
      start(controller) {
        controller.enqueue(new TextEncoder().encode(jsonString))
        controller.close()
      },
    })

    const compressionStream = new CompressionStream("gzip")
    const compressedStream = jsonStream.pipeThrough(compressionStream)

    const response = new Response(compressedStream)
    const blob = await response.blob()

    const compressedFile = new File([blob], fileName, {
      type: "application/gzip",
    })

    return compressedFile
  } catch (error) {
    console.error("Compression failed:", error)
    throw error
  }
}

export async function decompress(file: File): Promise<string> {
  try {
    const fileStream = file.stream()

    const decompressionStream = new DecompressionStream("gzip")
    const decompressedStream = fileStream.pipeThrough(decompressionStream)

    const response = new Response(decompressedStream)
    const decompressedText = await response.text()

    return decompressedText
  } catch (error) {
    console.error("Decompression failed:", error)
    throw error
  }
}
