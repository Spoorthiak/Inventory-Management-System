package com.training.service;

import java.util.ArrayList;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.training.business.bean.MaterialTypeBean;
import com.training.dao.MaterialTypeDAO;
import com.training.entity.MaterialTypeEntity;
@Service
public class MaterialTypeServiceImpl implements MaterialTypeService{
	
	@Autowired
	private MaterialTypeDAO materialTypeDAO;

	@Override
	public List<MaterialTypeBean> getMaterialTypesBasedOnCategoryId(String categoryId) {	
		List<MaterialTypeBean> beans = new ArrayList<>();
		List<MaterialTypeEntity> entities = materialTypeDAO.findByMaterialCategoryEntityCategoryId(categoryId);
		if (entities != null && !entities.isEmpty()) {
			MaterialTypeBean bean = null;
			for (MaterialTypeEntity entity : entities) {
				bean = new MaterialTypeBean();
				bean.setTypeId(entity.getTypeId());
				bean.setTypeName(entity.getTypeName());
				bean.setCategoryId(entity.getMaterialCategoryEntity().getCategoryId());
				beans.add(bean);
			}
		}
		return beans;
	}

	@Override
	public List<MaterialTypeBean> getMaterialTypes() {
		List<MaterialTypeBean> beans = new ArrayList<>();
		List<MaterialTypeEntity> entities = materialTypeDAO.findAll();
		if (!entities.isEmpty()) {
			MaterialTypeBean bean = null;
			for (MaterialTypeEntity entity : entities) {
				bean = new MaterialTypeBean();
				bean.setTypeId(entity.getTypeId());
				bean.setTypeName(entity.getTypeName());
				bean.setCategoryId(entity.getMaterialCategoryEntity().getCategoryId());
				beans.add(bean);
			}
		}
		return beans;
	}

	
}
