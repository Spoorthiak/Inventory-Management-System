package com.training.web.controller;

import java.util.List;

import javax.servlet.http.HttpSession;
import javax.validation.Valid;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.SessionAttributes;

import com.training.business.bean.MaterialCategoryBean;
import com.training.business.bean.MaterialTypeBean;
import com.training.business.bean.PurchaseBean;
import com.training.business.bean.UnitBean;
import com.training.business.bean.VendorBean;
import com.training.exceptions.MicroServiceException;
import com.training.service.PurchaseService;
import com.training.web.client.MaterialCategoryConsumer;
import com.training.web.client.MaterialTypeConsumer;
import com.training.web.client.UnitServiceConsumer;
import com.training.web.client.VendorServiceConsumer;


@CrossOrigin(origins = {
    "http://localhost:5173",
    "https://ims-frontend-ti4c.onrender.com"
})
@RestController
@SessionAttributes({ "purchaseBean" })
public class PurchaseEntryController {

    private static Logger LOGGER = LoggerFactory.getLogger(PurchaseEntryController.class);

	@Autowired
	private PurchaseService purchaseService;

	@Autowired
	private VendorServiceConsumer vendorServiceConsumer;

	@Autowired
	private MaterialCategoryConsumer materialCategoryConsumer;

	@Autowired
	private UnitServiceConsumer unitServiceConsumer;

	@Autowired
	private MaterialTypeConsumer materialTypeConsumer;

    @GetMapping("purchaseEntry")
	public ResponseEntity<PurchaseBean> purchaseEntry() throws Exception {
		return ResponseEntity.ok(new PurchaseBean());
    }

    @GetMapping("vendors")
	public ResponseEntity<List<VendorBean>> generateVendorList() throws MicroServiceException {
		List<VendorBean> vendors = vendorServiceConsumer.getVendorBeanList();
		return ResponseEntity.ok(vendors == null ? List.of() : vendors);
    }

    @PostMapping("getUnitAndTypeList")
	public ResponseEntity<UnitAndTypeResponse> generateUnitAndTypeList(@RequestBody PurchaseBean purchaseBean,
													   HttpSession session) throws MicroServiceException {
		List<UnitBean> units = unitServiceConsumer.hitGetUnitsByCategoryId(purchaseBean.getMaterialCategoryId());
		List<MaterialTypeBean> materialTypes = materialTypeConsumer
				.hitGetTypesBasedOnCategoryId(purchaseBean.getMaterialCategoryId());
		session.setAttribute("purchaseBean", purchaseBean);
		return ResponseEntity.ok(new UnitAndTypeResponse(units == null ? List.of() : units,
				materialTypes == null ? List.of() : materialTypes));
    }

    @GetMapping("categories")
	public ResponseEntity<List<MaterialCategoryBean>> generateCategoryList() throws MicroServiceException {
		List<MaterialCategoryBean> categories = materialCategoryConsumer.getMaterialCategoryBeanList();
		return ResponseEntity.ok(categories == null ? List.of() : categories);
    }
	
   
    @PostMapping("addPurchaseDetail")
    public ResponseEntity<PurchaseResponse> addPurchaseDetail( @RequestBody @Valid PurchaseBean purchaseBean,
            								  HttpSession session) throws Exception {

        LOGGER.info("Execution Started [addPurchaseDetail]");
        MaterialCategoryBean category = materialCategoryConsumer.hitGetMaterialCategoryById(purchaseBean.getMaterialCategoryId());

        if (category != null) {
            purchaseBean.setMaterialCategoryName(
                    category.getCategoryName());
        }
        
        PurchaseBean savedPurchaseBean = purchaseService.addPurchaseDetails(purchaseBean);

        List<MaterialTypeBean> materialTypes = materialTypeConsumer.hitGetTypesBasedOnCategoryId(
                                                       savedPurchaseBean.getMaterialCategoryId());

        if (materialTypes != null) {
            for (MaterialTypeBean type : materialTypes) {
                if (type.getTypeId().equals(
                        savedPurchaseBean.getMaterialTypeId())) {
                			savedPurchaseBean.setMaterialTypeName(
                            type.getTypeName());
                			break;
                }
            }
        }

        List<UnitBean> units = unitServiceConsumer.hitGetUnitsByCategoryId(savedPurchaseBean.getMaterialCategoryId());

        if (units != null) {
            for (UnitBean unit : units) {
                if (unit.getUnitId().equals(
                        savedPurchaseBean.getUnitId())) {
                			savedPurchaseBean.setMaterialUnitName(
                            unit.getUnitName());
                			break;
                }
            }
        }
        session.setAttribute("purchaseBean", savedPurchaseBean);
        LOGGER.info("Execution Over [addPurchaseDetail]");
        return ResponseEntity.ok(new PurchaseResponse("SUCCESS","Purchase details added successfully",savedPurchaseBean));
    }
  
    @GetMapping("purchases")
    public ResponseEntity<java.util.List<PurchaseBean>> getAllPurchases()
            throws Exception {

        return ResponseEntity.ok(purchaseService.getAllPurchaseDetails());
    }


    public static class UnitAndTypeResponse {
		private List<UnitBean> unitList;
		private List<MaterialTypeBean> materialTypeList;

		public UnitAndTypeResponse() {
			super();
		}

		public UnitAndTypeResponse(List<UnitBean> unitList, List<MaterialTypeBean> materialTypeList) {
			this.unitList = unitList;
			this.materialTypeList = materialTypeList;
		}

		public List<UnitBean> getUnitList() {
			return unitList;
		}

		public List<MaterialTypeBean> getMaterialTypeList() {
			return materialTypeList;
		}
    }

    public static class PurchaseResponse {
        private String status;
        private String message;
		private PurchaseBean purchase;

		public PurchaseResponse(String status, String message, PurchaseBean purchase) {
            this.status = status;
            this.message = message;
			this.purchase = purchase;
        }

        public String getStatus() { return status; }
        public String getMessage() { return message; }
		public PurchaseBean getPurchase() { return purchase; }
    }
  
}