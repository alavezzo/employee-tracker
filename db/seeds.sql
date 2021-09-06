INSERT INTO department (name)
VALUES 
    ('Manufacturing'),
    ('Engineering'), 
    ('Sales'), 
    ('HR'),
    ('Product Management')

INSERT INTO role (title, salary, department_id)
VALUES 
    ('Manager', 250000, 1),
    ('Manager', 300000, 2),
    ('Manager', 200000, 3),
    ('Manager', 175000, 4),
    ('Manager', 125000, 5),
    ('Manafacturing Associate', 70000, 1),
    ('Engineer', 200000, 2),
    ('Sales Associate', 65000, 3),
    ('HR Rep', 55000, 4),
    ('Project Leader', 85000, 5)

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES
    ('Billy', 'Bob Jenkins', 1, NULL),
    ('Jamie', 'Joy', 2, NULL),
    ('Sally', 'Sutra', 3, NULL),
    ('Stanley', 'Rubix', 4, NULL),
    ('Stephanie', 'Starr', 5, NULL),
    ('Corey', 'Casover', 6, 1)