IF (1 =1    ) BEGIN
	SELECT j.job_id, j.job_desc,
		e.emp_id,		e.fname,
		e.lname,e.job_id,
		e.hire_date
	FROM jobs j 	INNER 
	JOIN employee e ON 
	j.job_id = e.job_id
	ORDER BY j.job_desc,
				e.fname, e.lname END