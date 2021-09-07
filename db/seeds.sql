INSERT INTO departments (name)
VALUES 
    ('Manufacturing'),
    ('Engineering'), 
    ('Sales'), 
    ('HR'),
    ('Product Management');

INSERT INTO roles (title, salary, department_id)
VALUES 
    ('Manager Manufacturing', 250000, 1),
    ('Manager Engineer', 300000, 2),
    ('Manager Sales', 200000, 3),
    ('Manager HR', 175000, 4),
    ('Manager Product Management', 125000, 5),
    ('Manafacturing Associate', 70000, 1),
    ('Engineer', 200000, 2),
    ('Sales Associate', 65000, 3),
    ('HR Rep', 55000, 4),
    ('Project Leader', 85000, 5);

INSERT INTO employees (first_name, last_name, role_id, manager_id)
VALUES
    ('Billy', 'Bob Jenkins', 1, NULL),
    ('Jamie', 'Joy', 2, NULL),
    ('Sally', 'Sutra', 3, NULL),
    ('Stanley', 'Rubix', 4, NULL),
    ('Stephanie', 'Starr', 5, NULL);