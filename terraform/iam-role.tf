data "aws_iam_policy" "required-policy" {
    name = "AmazonS3FullAccess"
}

resource "aws_iam_role" "ec2-role" {
    name = "ec2-role"
    assume_role_policy = jsoncode({
        Version = "2012-10-17"
        Statement = [
            {
                Action = "sts:AssumeRole"
                Effect = "Allow"
                Sid = ""
                Principal = {
                    Service = "ec2.amazonaws.com"
                }
            },
        ]
    })
}

resource "aws_iam__role_policy_attachment" "attach-s3" {
    role = aws_iam__role.ec2-role.name
    policy_arn = data.aws_iam_policy.required-policy.arn
}

resource "aws_iam_instace_profile" "ec2-role" {
    name = "ec2-role"
    role = aws_iam_role.ec2-role.name
}