package com.training.service;

import java.util.ArrayList;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.training.business.bean.MaterialCategoryBean;
import com.training.dao.MaterialCategoryDAO;
import com.training.entity.MaterialCategoryEntity;

@Service
public class MaterialServiceImpl implements MaterialService {

	private static final Logger logger = LoggerFactory.getLogger(MaterialServiceImpl.class);

	@Autowired
	private MaterialCategoryDAO materialCategoryDAO;
	
	@Override
	public MaterialCategoryBean getMaterialCategoryById(String categoryId) {
		MaterialCategoryBean materialCategoryBean = null;
		MaterialCategoryEntity entity = materialCategoryDAO.findById(categoryId).orElse(null);
		if (entity != null) {
			materialCategoryBean = new MaterialCategoryBean();
			materialCategoryBean.setCategoryId(entity.getCategoryId());
			materialCategoryBean.setCategoryName(entity.getCategoryName());
		}
		return materialCategoryBean;
	}
	
	@Override
	public List<MaterialCategoryBean> getMaterialCategories() {
		List<MaterialCategoryBean> materialCategoryBeans = new ArrayList<>();
		List<MaterialCategoryEntity> entities = materialCategoryDAO.findAll();
		if (!entities.isEmpty()) {
			MaterialCategoryBean bean = null;
			for (MaterialCategoryEntity entity : entities) {
				bean = new MaterialCategoryBean();
				bean.setCategoryId(entity.getCategoryId());
				bean.setCategoryName(entity.getCategoryName());
				materialCategoryBeans.add(bean);
			}
		}
		return materialCategoryBeans;
	}

}
