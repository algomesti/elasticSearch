up:
	docker run -d -p 3001:3001 -it --name operand_log operandlog

down:
	docker rm -f operand_log


build:
	docker build -t operandlog .

elkdev:
	docker rm elk; docker run -p 5601:5601 -p 9200:9200 -p 5044:5044 -it --name elk sebp/elk