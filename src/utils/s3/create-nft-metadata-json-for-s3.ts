export default function createNFTMetadataJSONForS3(uploadedNFTData: UploadNFT, imageUrl: string): NFTMetadataJSON {
	return {
		imageUrl,
		...uploadedNFTData
	}
}
