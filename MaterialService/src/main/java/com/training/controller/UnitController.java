package com.training.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.training.business.bean.UnitBean;
import com.training.service.UnitService;

@RestController
public class UnitController {
	
	@Autowired
	private UnitService unitService;
	
	@GetMapping(value="unit/controller/getUnitDetails",produces=MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<List<UnitBean>> getUnitDetails(){
		List<UnitBean> units = unitService.getUnits();
		return ResponseEntity.ok(units);
	}
	
	@GetMapping(value="unit/controller/getUnitsByCategoryId/{categoryId}",produces=MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<List<UnitBean>> getUnitsByCategoryId(@PathVariable("categoryId") String categoryId){
		List<UnitBean> units = unitService.getUnitsBasedOnCategoryId(categoryId);
		return ResponseEntity.ok(units);
	}	

}
