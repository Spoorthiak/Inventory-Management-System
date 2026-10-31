
-- MATERIAL CATEGORY TABLE
INSERT INTO material_category (category_id, category_name) VALUES ('C001', 'Thread'), ('C002', 'Cloth'), ('C003', 'Button');

-- MATERIAL TYPE TABLE
INSERT INTO material_type (type_id, type_name, category_id) VALUES ('T001','Silk','C001'), ('T002','Silk','C002'), ('T003','Linen','C001'), ('T004','Linen','C002'), ('T005','Silk Cotton','C003'), ('T006','Suit','C003'), ('T007','Silk Cotton','C002');

-- UNIT TABLE
INSERT INTO unit (unit_id, unit_name, category_id) VALUES ('U001','Metres','C001'), ('U002','Metres','C002'), ('U003','Yards','C001'), ('U004','Yards','C002'), ('U005','Kilograms','C003');
