SELECT top 100000 
deal.sysID as dealID,


(
/* bidder deals */

SELECT
	(SELECT count(sysId)
		FROM tblDealBTV btv2bd
		WHERE btv2bd.btvCompanySysID IN 
		(
			SELECT btv3bd.btvCompanySysID
			FROM tblDeal d2bd LEFT JOIN tblDealBTV btv3bd ON d2bd.sysID = btv3bd.dealSysID
			
			AND d2bd.sysId = dbd.sysID
			AND d2bd.dtsCompleted is not null 
		))
FROM tblDeal dbd
WHERE dbd.sysId = deal.sysId
) as dealsByBidders,


(
/* bidder successes */

SELECT
	/*btv.btvCompanySysID*/
	(SELECT count(sysId)
		FROM tblDealBTV btv2bs
		WHERE btv2bs.btvCompanySysID IN 
		(
			SELECT btv3bs.btvCompanySysID
			FROM tblDeal d2bs LEFT JOIN tblDealBTV btv3bs ON d2bs.sysID = btv3bs.dealSysID
			WHERE btv2bs.typeCode = 'BIDDER'
			AND d2bs.sysId = dbs.sysID
			AND d2bs.dtsCompleted is not null 
		)
		AND typeCode = 'BIDDER')
FROM tblDeal dbs
WHERE dbs.sysId = deal.sysId
) as successByBidders,

(
/* bidders */

SELECT count(btvb.btvCompanySysID)
			FROM tblDeal db LEFT JOIN tblDealBTV btvb ON db.sysID = btvb.dealSysID
			WHERE btvb.typeCode = 'BIDDER'
			AND db.sysId = deal.sysId
) as totalBidders,

(
/* targets */
SELECT count(btvt.btvCompanySysID)
			FROM tblDeal dt LEFT JOIN tblDealBTV btvt ON dt.sysID = btvt.dealSysID
			WHERE btvt.typeCode = 'TARGET'
			AND dt.sysId = deal.sysId
) as totalTargets,

IIF(deal.dtsCompleted is null, 0, 1) as completed

FROM tblDeal as deal
WHERE sysDtsCreated > 2010-01-01