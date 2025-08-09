resource "aws_lb" "myalb" {
    name = "traveler-project"
    internal = false
    security_groups = [ aws_security_group.web_server-lb.id, aws_security_group.internal.id ]
    load_balancer_type = "application"
    subnets = module.vpc.public_subnets
}

resource "aws_lb_target_group" "front" {
    name = "Frontend"
    target_type = "instance" 
    port = "3000"
    protocol = "HTTP"
    vpc_id = module.vpc.vpc_id

    health_check {
        path = "/"
        protocol= "HTTP"
        matcher = "200"
        interval = 6
        healty_threshold = 2
    }

    tags = {
        Name = "Frontend"
    }
}

resource "aws_lb_target_group" "back" {
    name = "Backend"
    target_type = "instance" 
    port = "3010"
    protocol = "HTTP"
    vpc_id = module.vpc.vpc_id

    health_check {
        port = "3000"
        path = "/"
        protocol= "HTTP"
        matcher = "200"
        interval = 6
        healty_threshold = 2
    }

    tags = {
        Name = "Backend"
    }
}

resource "aws_lb_listener" "http" {
    load_balancer_arn = aws_lb.myalb.arn
    port = "80"
    protocol = "HTTP"

    default_action {
        type = "forward"
        target_group_arn = aws_lb_target_group.front.arn
    }
}

resource "aws_lb_listener_rule" "static" {
    listeners_arn = aws_lb_listener.http.arn
    priority = 1

    action {
        type = "forward"
        target_group_arn = aws_lb_target_group.back.arn
    }

    condition {
        path_pattern {
            values = ["/s3/album/*"]
        }
    }
}

output "elb_dns_name" {
    value = aws_lb.myalb.dns_name
    description = "The domain name of the LB"
}