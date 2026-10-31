package com.training.service;

import java.util.List;

import com.training.business.bean.PurchaseBean;

public interface PurchaseService {
	public PurchaseBean addPurchaseDetails(PurchaseBean purchaseBean) throws Exception;
	public List<PurchaseBean> getAllPurchaseDetails() throws Exception;
	
}

