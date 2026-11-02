package com.training.web.controller;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import com.training.business.bean.MaterialCategoryBean;
import com.training.business.bean.MaterialTypeBean;
import com.training.business.bean.PurchaseBean;
import com.training.business.bean.UnitBean;
import com.training.business.bean.VendorWisePurchaseReportBean;
import com.training.exceptions.MicroServiceException;
import com.training.service.ReportsService;
import com.training.web.client.MaterialCategoryConsumer;
import com.training.web.client.MaterialTypeConsumer;
import com.training.web.client.UnitServiceConsumer;
import com.training.web.client.VendorServiceConsumer;


@Controller
@CrossOrigin(origins = {
    "http://localhost:5173",
    "https://ims-frontend-ti4c.onrender.com"
})
public class ReportsController {

	private static Logger LOGGER = LoggerFactory.getLogger(ReportsController.class);

	@Autowired
	private ReportsService reportsService;

	@Autowired
	private MaterialCategoryConsumer materialCategoryConsumer;

	@Autowired
	private UnitServiceConsumer unitServiceConsumer;

	@Autowired
	private MaterialTypeConsumer materialTypeConsumer;

	@Autowired
	private VendorServiceConsumer vendorServiceConsumer;
	
	List <PurchaseBean> purchaseIdList;

	@RequestMapping(value="report/controller/getPurchaseDetails",
			method=RequestMethod.POST,
			consumes = MediaType.APPLICATION_JSON_VALUE,
			produces = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<List<PurchaseBean>> getPurchaseDetails(@RequestBody VendorWisePurchaseReportBean bean) throws MicroServiceException
	{
		LOGGER.info("Execution Started [getPurchaseDetails]");

		List<PurchaseBean> reportList = reportsService.getVendorWisePurchaseDetails(
		        bean.getFromDate(), bean.getToDate(),
		        bean.getVendorName());

		for (PurchaseBean purchase : reportList) {
		    MaterialCategoryBean category =
		            materialCategoryConsumer.hitGetMaterialCategoryById(
		                    purchase.getMaterialCategoryId());

		    if (category != null) {
		        purchase.setMaterialCategoryName(category.getCategoryName());
		    }

		    List<MaterialTypeBean> materialTypes =
		            materialTypeConsumer.hitGetTypesBasedOnCategoryId(
		                    purchase.getMaterialCategoryId());

		    for (MaterialTypeBean type : materialTypes) {
		        if (type.getTypeId().equals(purchase.getMaterialTypeId())) {
		            purchase.setMaterialTypeName(type.getTypeName());
		            break;
		        }
		    }

		    List<UnitBean> units =
		            unitServiceConsumer.hitGetUnitsByCategoryId(
		                    purchase.getMaterialCategoryId());

		    for (UnitBean unit : units) {
		        if (unit.getUnitId().equals(purchase.getUnitId())) {
		            purchase.setMaterialUnitName(unit.getUnitName());
		            break;
		        }
		    }
		}

		LOGGER.info("Execution Over [getPurchaseDetails]");
		return ResponseEntity.ok(reportList);
	}
		
	
}