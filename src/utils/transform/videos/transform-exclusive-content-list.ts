export default function transformExclusiveContentList(myExclusiveContentList: RetrievedMyExclusiveContentData[]): MyExclusiveContentData[] {
	try {
		return myExclusiveContentList.map(exclusiveContent => ({
			videoName: exclusiveContent.video.video_name,
			imageUrl: exclusiveContent.video.uploaded_image.image_url,
			uuid: exclusiveContent.video.uuid,
			videoDurationSeconds: exclusiveContent.video.uploaded_video.video_duration_seconds,
			purchaseDate: exclusiveContent.created_at,
			priceInSol:
				exclusiveContent.exclusive_video_access_purchase_fortuna_take.sol_amount_transferred +
				exclusiveContent.exclusive_video_access_purchase_sol_transfer.sol_amount_transferred,
			priceInUsd:
				exclusiveContent.exclusive_video_access_purchase_fortuna_take.usd_amount_transferred +
				exclusiveContent.exclusive_video_access_purchase_sol_transfer.usd_amount_transferred,
			channelName: exclusiveContent.video.video_creator.channel_name?.channel_name ||
				exclusiveContent.video.video_creator.username || "",
			creatorProfilePictureUrl: exclusiveContent.video.video_creator.profile_picture?.image_url || null,
			creatorUsername: exclusiveContent.video.video_creator.username || "",

			newWalletBalanceSol: exclusiveContent.exclusive_video_access_purchase_sol_transfer.sender_new_wallet_balance_sol,
			newWalletBalanceUsd: exclusiveContent.exclusive_video_access_purchase_sol_transfer.sender_new_wallet_balance_usd
		}))
	} catch (error) {
		console.error(error)
		throw error
	}
}
