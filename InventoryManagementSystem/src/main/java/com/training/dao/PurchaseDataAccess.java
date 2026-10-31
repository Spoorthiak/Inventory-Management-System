package com.training.dao;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.training.business.bean.MaterialCategoryBean;
import com.training.business.bean.MaterialTypeBean;
import com.training.business.bean.PurchaseBean;
import com.training.business.bean.UnitBean;
import com.training.entity.PurchaseEntity;
import com.training.web.client.MaterialCategoryConsumer;
import com.training.web.client.MaterialTypeConsumer;
import com.training.web.client.UnitServiceConsumer;

@Repository
public class PurchaseDataAccess {
	
	@Autowired
	private PurchaseDAO purchaseDAO;
	
	@Autowired
	private MaterialCategoryConsumer materialCategoryConsumer;

	@Autowired
	private MaterialTypeConsumer materialTypeConsumer;

	@Autowired
	private UnitServiceConsumer unitServiceConsumer;

	public PurchaseBean savePurchaseDetail(PurchaseBean purchaseBean) throws Exception {
		PurchaseEntity purchaseEntity = new PurchaseEntity();
		purchaseEntity.setVendorName(purchaseBean.getVendorName());
		purchaseEntity.setMaterialCategoryId(purchaseBean.getMaterialCategoryId());
		purchaseEntity.setMaterialTypeId(purchaseBean.getMaterialTypeId());
		purchaseEntity.setBrandName(purchaseBean.getBrandName());
		purchaseEntity.setUnitId(purchaseBean.getUnitId());
		purchaseEntity.setQuantity(purchaseBean.getQuantity());
		purchaseEntity.setPurchaseAmount(purchaseBean.getPurchaseAmount());
		purchaseEntity.setPurchaseDate(purchaseBean.getPurchaseDate());
		purchaseEntity.setTransactionId(purchaseBean.getTransactionId());
		purchaseEntity.setStatus("SUCCESS");

		PurchaseEntity savedPurchaseEntity = purchaseDAO.save(purchaseEntity);

		PurchaseBean savedPurchaseBean = new PurchaseBean();
		savedPurchaseBean.setPurchaseId(savedPurchaseEntity.getPurchaseId());
		savedPurchaseBean.setTransactionId(savedPurchaseEntity.getTransactionId());
		savedPurchaseBean.setVendorName(savedPurchaseEntity.getVendorName());
		savedPurchaseBean.setMaterialCategoryId(savedPurchaseEntity.getMaterialCategoryId());
		savedPurchaseBean.setMaterialTypeId(savedPurchaseEntity.getMaterialTypeId());
		savedPurchaseBean.setBrandName(savedPurchaseEntity.getBrandName());
		savedPurchaseBean.setUnitId(savedPurchaseEntity.getUnitId());
		savedPurchaseBean.setQuantity(savedPurchaseEntity.getQuantity());
		savedPurchaseBean.setPurchaseAmount(savedPurchaseEntity.getPurchaseAmount());
		// balance=purchaseAmount
		savedPurchaseBean.setBalance(savedPurchaseEntity.getPurchaseAmount());
		savedPurchaseBean.setPurchaseDate(savedPurchaseEntity.getPurchaseDate());
		savedPurchaseBean.setStatus(savedPurchaseEntity.getStatus());

		return savedPurchaseBean;
	}
	
	public List<PurchaseBean> getAllPurchaseDetails() throws Exception {

	    List<PurchaseEntity> entities = purchaseDAO.findAll();

	    List<PurchaseBean> purchaseBeans = new ArrayList<>();

	    for (PurchaseEntity entity : entities) {

	        PurchaseBean bean = new PurchaseBean();

	        bean.setPurchaseId(entity.getPurchaseId());
	        bean.setTransactionId(entity.getTransactionId());
	        bean.setVendorName(entity.getVendorName());
	        bean.setMaterialCategoryId(entity.getMaterialCategoryId());
	        bean.setMaterialTypeId(entity.getMaterialTypeId());
	        bean.setBrandName(entity.getBrandName());
	        bean.setUnitId(entity.getUnitId());
	        bean.setQuantity(entity.getQuantity());
	        bean.setPurchaseAmount(entity.getPurchaseAmount());
	        bean.setBalance(entity.getPurchaseAmount());
	        bean.setPurchaseDate(entity.getPurchaseDate());
	        bean.setStatus(entity.getStatus());

	        MaterialCategoryBean category =
	                materialCategoryConsumer.hitGetMaterialCategoryById(
	                        entity.getMaterialCategoryId());

	        if (category != null) {
	            bean.setMaterialCategoryName(category.getCategoryName());
	        }

	        List<MaterialTypeBean> materialTypes =
	                materialTypeConsumer.hitGetTypesBasedOnCategoryId(
	                        entity.getMaterialCategoryId());

	        if (materialTypes != null) {
	            for (MaterialTypeBean type : materialTypes) {

	                if (type.getTypeId().equals(entity.getMaterialTypeId())) {
	                    bean.setMaterialTypeName(type.getTypeName());
	                    break;
	                }
	            }
	        }

	        List<UnitBean> units =
	                unitServiceConsumer.hitGetUnitsByCategoryId(
	                        entity.getMaterialCategoryId());

	        if (units != null) {
	            for (UnitBean unit : units) {

	                if (unit.getUnitId().equals(entity.getUnitId())) {
	                    bean.setMaterialUnitName(unit.getUnitName());
	                    break;
	                }
	            }
	        }

	        purchaseBeans.add(bean);
	    }

	    return purchaseBeans;
	}
	
	public void updateTransactionId(Integer purchaseId, String transactionId)
	        throws Exception {

	    PurchaseEntity purchaseEntity =
	            purchaseDAO.findById(purchaseId).orElse(null);

	    if (purchaseEntity != null) {
	        purchaseEntity.setTransactionId(transactionId);
	        purchaseDAO.save(purchaseEntity);
	    }
	}
}