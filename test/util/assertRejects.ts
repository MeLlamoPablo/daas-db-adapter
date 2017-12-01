export const assertRejects = (p: Promise<any>) =>
	new Promise<void>((resolve, reject) =>
		p
			.then(() =>
				reject(
					new Error(
						"Expected the Promise to reject, but it" + " resolved instead"
					)
				)
			)
			.catch(resolve)
	)
