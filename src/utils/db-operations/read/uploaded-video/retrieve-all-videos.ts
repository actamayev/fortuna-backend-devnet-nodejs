// import prismaClient from "../../../../prisma-client"

// // TODO: Retrieve video and image content (join on uuid)
// export default async function retrieveAllVideos(): Promise<VideoRetrievedFromDB[]> {
// 	try {
// 		const retrievedVideos = await prismaClient.uploaded_video.findMany({
// 			select: {
// 				video_url: true,
// 				created_at: true,
// 				uuid: true,
// 				spl: {
// 					select: {
// 						spl_name: true,
// 						listing_price_per_share_sol: true,
// 						description: true,
// 						total_number_of_shares: true,
// 						public_key_address: true,
// 						spl_transfer: {
// 							select: {
// 								number_spl_shares_transferred: true
// 							}
// 						}
// 					}
// 				}
// 			}
// 		})

// 		return retrievedVideos
// 	} catch (error) {
// 		console.error(error)
// 		throw error
// 	}
// }
